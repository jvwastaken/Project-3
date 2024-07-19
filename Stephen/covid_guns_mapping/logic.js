let map;
let markers = [];

d3.json('covid_cases.json').then(data => {
    initializeMap();
    window.covidData = data; // Store data globally for access in updateMap function
    updateMap();
});

function initializeMap() {
    // Create the Esri satellite base layer.
    let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri'
    });

    // Create the grayscale base layer.
    let grayscale = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    // Create the outdoor base layer.
    let outdoors = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Satellite Map": satellite,
        "Grayscale Map": grayscale,
        "Outdoors Map": outdoors
    };

    // Initialize the map
    map = L.map('map', {
        center: [37.8, -96],
        zoom: 4,
        layers: [satellite] // Default layer
    });

    // Add the layer control to the map
    L.control.layers(baseMaps).addTo(map);
}

function updateMap() {
    const selectedDate = document.getElementById('date-select').value;

    // Remove existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Add new markers based on selected date
    covidData.forEach(stateData => {
        const cases = stateData[selectedDate];
        if (cases !== undefined) {
            const marker = L.circleMarker([stateData.Lat, stateData.Long_], {
                radius: Math.sqrt(cases) / 100, // Adjust size based on cases
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            }).addTo(map);

            marker.bindPopup(`<b>${stateData.State}</b><br>Cases: ${cases}`);
            markers.push(marker);
        }
    });
}
