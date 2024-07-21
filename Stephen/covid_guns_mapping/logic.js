let map;
let covidMarkers = [];
let gunSalesMarkers = [];
let gunSalesLayer;
let covidLayer;

d3.json('covid_cases.json').then(data => {
    initializeMap();
    window.covidData = data; // Store data globally for access in updateMap function
    updateMap();
});

d3.json('covid_guns.json').then(data => {
    window.gunSalesData = data; // Store data globally for access in updateGunSalesMap function
    updateGunSalesMap();
}).catch(error => {
    console.error('Error loading gun sales data:', error); // Log any errors
});

function initializeMap() {
    // Create the grayscale base layer.
    let grayscale = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    // Initialize the map
    map = L.map('map', {
        center: [37.8, -96],
        zoom: 4,
        layers: [grayscale] // Default layer
    });

    // Create empty layers for COVID and gun sales markers
    covidLayer = L.layerGroup();
    gunSalesLayer = L.layerGroup();

    // Create a baseMaps object.
    let baseMaps = {
        "Grayscale Map": grayscale
    };

    // Create an overlayMaps object.
    let overlayMaps = {
        "COVID-19 Cases": covidLayer,
        "2023 Gun Sales": gunSalesLayer
    };

    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    // Add default layers to the map
    covidLayer.addTo(map);
}

function updateMap() {
    const selectedDate = document.getElementById('date-select').value;

    // Clear existing COVID markers
    covidLayer.clearLayers();

    // Add new markers based on selected date for COVID data
    covidData.forEach(stateData => {
        const cases = stateData[selectedDate];
        if (cases !== undefined) {
            const marker = L.circleMarker([stateData.Lat, stateData.Long_], {
                radius: Math.sqrt(cases) / 100, // Adjust size based on cases
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            });

            marker.bindPopup(`<b>${stateData.State}</b><br>Cases: ${cases}`);
            covidLayer.addLayer(marker);
        }
    });
}

function updateGunSalesMap() {
    // Clear existing gun sales markers
    gunSalesLayer.clearLayers();

    // Add new markers for gun sales data
    gunSalesData.forEach(stateData => {
        const sales = +stateData['2023 Total Estimated Sales']; // Convert to number
        if (!isNaN(sales) && stateData.Lat && stateData.Long_) {
            const lat = parseFloat(stateData.Lat);
            const long = parseFloat(stateData.Long_);
            const marker = L.circleMarker([lat, long], {
                radius: Math.sqrt(sales) / 100, // Adjust size based on sales
                color: 'gray',
                fillColor: 'gray',
                fillOpacity: 0.5
            });

            marker.bindPopup(`<b>${stateData.State}</b><br>2023 Gun Sales: ${sales}`);
            gunSalesLayer.addLayer(marker);
        }
    });
}

// Ensure update functions are called when updating map
document.getElementById('date-select').addEventListener('change', () => {
    updateMap();
    updateGunSalesMap();
});
