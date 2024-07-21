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
// Stephen's map //../../Stephen/covid_cases_mapping/covid_cases.json
let map;
let covidMarkers = [];
let gunSalesMarkers = [];
let gunSalesLayer;
let covidLayer;
let hospitalMarkers = L.markerClusterGroup(); // Initialize hospitalMarkers as a cluster group

d3.json('../../Stephen/covid_guns_mapping/covid_cases.json').then(data => {
    initializeMap();
    window.covidData = data; // Store data globally for access in updateMap function
    updateMap();
});

d3.json('../../Stephen/covid_guns_mapping/covid_guns.json').then(data => {
    console.log(data); // Add this line to check if data is loaded correctly
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
      "Grayscale": grayscale
    };

    // Create an overlay object.
    let overlayMaps = {
        "COVID-19 Cases": covidLayer,
        "2023 Gun Sales": gunSalesLayer,
        "Hospitals": hospitalMarkers // Add hospitalMarkers to overlay
    };

    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    // Add hospitalMarkers to the map
    hospitalMarkers.addTo(map);
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

d3.json("../../Vivian/Resources/cleaned_hospitals.json").then(hospitalData => {
    hospitalData.forEach(hospital => {
        let hospitalMarker = L.marker([hospital.Info.Latitude, hospital.Info.Longitude]);
        hospitalMarker.bindPopup(`<b>${hospital["Hospital Name"]}</b><br>${hospital.Info.Address}, ${hospital.Info.City}, ${hospital.Info.State}`);
        hospitalMarkers.addLayer(hospitalMarker); // Add marker to the cluster group
    });
});

// Ensure update functions are called when updating map
document.getElementById('date-select').addEventListener('change', () => {
  updateMap();
  updateGunSalesMap();
});
