let filteredCovidData;

// Load state options from cleaned_hospitals.json
function loadStateOptions() {
  d3.json("../../Vivian/Resources/cleaned_hospitals.json").then((hospitalData) => {
    // Extract unique states from hospital data
    let states = new Set(hospitalData.map(hospital => hospital.Info.State));
    let stateSelect = d3.select("#selDataset");

    // For each unique state, create an option element in the dropdown
    states.forEach(state => {
      stateSelect.append("option").text(state).attr("value", state);
    });

    // Get the first state from the set
    let firstState = Array.from(states)[0];

    // Call the function to filter hospitals by state to get their info
    filterHospitalsByState(firstState);

    // Load covid cases data and filter based on the states from hospitals data
    d3.json("../../Stephen/csv_to_json_conversion/covid_cases.json").then((covidData) => {
      // Filter covid cases data based on the states from hospital data
      filteredCovidData = covidData.filter(covidCase => states.has(covidCase.State));

      // Now you can use the filteredCovidData for further processing -- TO BE COMPLETED
      console.log(filteredCovidData);
    });
  });
}

//-------------------------------------------------------------------------------------------------------
// This is the function to filter hospitals by state
function filterHospitalsByState(state) {
  d3.json("../../Vivian/Resources/cleaned_hospitals.json").then((data) => {
    // Filter the hospital data to only include hospitals in the selected state.
    let filteredHospitals = data.filter(hospital => hospital.Info.State === state);

    // Counting
    let openCount = filteredHospitals.filter(hospital => hospital.Info.Status === "Open").length;
    let helipadCount = filteredHospitals.filter(hospital => hospital.Info.Helipad === "Y").length;
    let traumaCount = filteredHospitals.filter(hospital => hospital.Info.Trauma !== "Not Available").length;
    let totalBeds = filteredHospitals.reduce((sum, hospital) => sum + hospital.Info.Beds, 0);

    // Display the information on the Hospitals info card
    let hospitalsDisplay = d3.select('#hospitals-display');

    // Clear previous content
    hospitalsDisplay.html("");

    // Append new content to display the hospital info
    hospitalsDisplay.append("h6").text(`Open Hospitals: ${openCount}`);
    hospitalsDisplay.append("h6").text(`Total Beds: ${totalBeds}`);
    hospitalsDisplay.append("h6").text(`Hospitals with Trauma: ${traumaCount}`);
    hospitalsDisplay.append("h6").text(`Hospitals with Helipad: ${helipadCount}`);
  });
}

//-------------------------------------------------------------------------------------------------------
// This is the function to filter gunsales by state
function filterGunSalesByState(state) {
  d3.json("../../Vivian/Resources/cleaned_gunsales.json").then((data) => {
    // Filter the gun data to only include gunsales in the selected state.
    let filteredGunSales = data.filter(gunsale => gunsale.State === state);

    // Display the information on the Gunsales info card
    let gunsaleDisplay = d3.select('#gunsale-display');

    // Clear previous content
    gunsaleDisplay.html("");

    // Append new content to display the gunsale info
    filteredGunSales.forEach(gunsale => {
      gunsaleDisplay.append("h6").text(`Estimated Gun Sales: ${gunsale['Gun Sales Info']['2023 Total Estimated Sales']}`);
      gunsaleDisplay.append("h6").text(`Guns Per Capita: ${gunsale['Gun Sales Info']['Guns Per Capita']}`);
    });
  });
}

//-------------------------------------------------------------------------------------------------------
// This function creates a bar chart based on the state chosen
function buildBarChart(selectedState) {
  // Clear the content inside the 'bar' div
  document.getElementById('bar').innerHTML = '';
  
  // Filter COVID-19 cases data for the selected state
  let selectedStateData = filteredCovidData.find(covidCase => covidCase.State === selectedState);

  if (selectedStateData) {
    // Extract date values and case counts
    let dates = Object.keys(selectedStateData).filter(key => key !== "State" && key !== "Lat" && key !== "Long_");
    let caseCounts = dates.map(date => selectedStateData[date]);

    // Create a Plotly bar chart
    let data = [{
      x: dates,
      y: caseCounts,
      type: 'bar'
    }];

    let layout = {
      title: `COVID-19 Cases in ${selectedState}`,
      xaxis: { title: 'Date' },
      yaxis: { title: 'Case Count' }
    };

    Plotly.newPlot('bar', data, layout);
  } else {
    console.log(`Data not found for ${selectedState}`);
    document.getElementById('bar').innerHTML = `<p><h1>Data not found for ${selectedState}</h1></p>`;
  }
}

//-------------------------------------------------------------------------------------------------------
// Handle state selection
// This function is called whenever a new state is selected from the dropdown. 
// It takes the selected state as an argument 
// and calls filterHospitalsByState and filterGunSalesByState with that state to update the displayed data.
function optionChanged(selectedState) {
  filterHospitalsByState(selectedState);
  filterGunSalesByState(selectedState);
  buildBarChart(selectedState);
}

//-------------------------------------------------------------------------------------------------------
// Initialize the dashboard, load state options
loadStateOptions();

//-------------------------------------------------------------------------------------------------------
// Stephen's map
let map;
let markers = [];

d3.json("../../Stephen/covid_cases_mapping/covid_cases.json").then(data => {
  initializeMap();
  window.covidData = data; // Store data globally for access in updateMap function
  updateMap();
});

function initializeMap() {
  let hospitalMarkers = L.layerGroup();
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

  // Create an overlayMaps object with hospital markers as an overlay
  let overlayMaps = {
    "Hospital Markers": hospitalMarkers
  };

  // Initialize the map
  map = L.map('map', {
    center: [37.8, -96],
    zoom: 4,
    layers: [satellite] // Default layer
  });

  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(map);

  // Define custom icon for the hospital marker
  let hospitalIcon = L.icon({
  iconUrl: '../Images/hospital.png',
  iconSize: [30, 30], // Size of the icon
  iconAnchor: [15, 30], // Anchor point of the icon
});
  // Load hospital coordinates JSON file and create custom markers
  d3.json("../../Vivian/Resources/cleaned_hospitals.json").then(hospitalData => {
  hospitalData.forEach(hospital => {
    let hospitalMarker = L.marker([hospital.Info.Latitude, hospital.Info.Longitude], { icon: hospitalIcon }).addTo(hospitalMarkers);
    hospitalMarker.bindPopup(`<b>${hospital["Hospital Name"]}</b><br>${hospital.Info.Address}, ${hospital.Info.City}, ${hospital.Info.State}`);
  });
});
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
