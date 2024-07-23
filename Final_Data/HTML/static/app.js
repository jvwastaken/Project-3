let filteredCovidData;

// Load state options from cleaned_hospitals.json
function loadStateOptions() {
  d3.json("http://127.0.0.1:5000/api/v1.0/hospitals").then((hospitalData) => {
    // Extract unique states from hospital data
    let states = new Set(hospitalData.map(hospital => hospital.State));
    console.log(states)
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
    d3.json("http://127.0.0.1:5000/api/v1.0/covid_cases").then((covidData) => {
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
  d3.json("http://127.0.0.1:5000/api/v1.0/hospitals").then((data) => {
    // Filter the hospital data to only include hospitals in the selected state.
    let filteredHospitals = data.filter(hospital => hospital.State === state);

    // Counting
    let openCount = filteredHospitals.filter(hospital => hospital.Status === "Open").length;
    let helipadCount = filteredHospitals.filter(hospital => hospital.Helipad === "Y").length;
    let traumaCount = filteredHospitals.filter(hospital => hospital.Trauma !== "Not Available").length;
    let totalBeds = filteredHospitals.reduce((sum, hospital) => sum + hospital.Beds, 0);

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
  // Fetch gun sales data from the API
  d3.json("http://127.0.0.1:5000/api/v1.0/gun_geo").then((data) => {
    // Filter the gun data to only include gun sales in the selected state
    let filteredGunSales = data.filter(gunsale => gunsale.State === state);

    // Select the gunsale display element
    let gunsaleDisplay = d3.select('#gunsale-display');

    // Clear previous content
    gunsaleDisplay.html("");

    // Append new content to display the gunsale info
    filteredGunSales.forEach(gunsale => {
      gunsaleDisplay.append("h6").text(`Estimated Gun Sales: ${gunsale['2023 Total Estimated Sales']}`);
      // Uncomment and ensure 'Guns Per Capita' is available in the data
      // gunsaleDisplay.append("h6").text(`Guns Per Capita: ${gunsale['Guns Per Capita']}`);
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

let map;
let covidMarkers = [];
let gunSalesMarkers = [];
let gunSalesLayer;
let covidLayer;
// Create a marker cluster group for military markers
let militaryMarkers = L.markerClusterGroup({
  iconCreateFunction: function(cluster) {
    return L.divIcon({
      html: `<div class="marker-cluster marker-cluster-custom military"><span>${cluster.getChildCount()}</span></div>`,
      className: '',
      iconSize: L.point(40, 40)
    });
  }
});

// Create a marker cluster group for hospital markers
let hospitalMarkers = L.markerClusterGroup({
  iconCreateFunction: function(cluster) {
    return L.divIcon({
      html: `<div class="marker-cluster marker-cluster-custom hospital"><span>${cluster.getChildCount()}</span></div>`,
      className: '',
      iconSize: L.point(40, 40)
    });
  }
});

d3.json('http://127.0.0.1:5000/api/v1.0/covid_cases').then(data => {
  initializeMap();
  window.covidData = data; // Store data globally for access in updateMap function
  updateMap();
});

d3.json('http://127.0.0.1:5000/api/v1.0/gun_geo').then(data => {
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
      "Hospitals": hospitalMarkers,
      "Military Bases": militaryMarkers};

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
            color: 'rgb(67, 118, 113)',
            fillColor: 'rgba(13, 133, 13, 0.432)',
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
    const sales = parseFloat(stateData['2023 Total Estimated Sales']); // Convert to number
    const lat = parseFloat(stateData.Lat);
    const long = parseFloat(stateData.Long_);
    const state = stateData.State;

    console.log(`State: ${state}, Sales: ${sales}, Lat: ${lat}, Long: ${long}`); // Debugging log

    if (!isNaN(sales) && !isNaN(lat) && !isNaN(long)) {
      const marker = L.circleMarker([lat, long], {
        radius: Math.sqrt(sales) / 100, // Adjust size based on sales
        color: 'gray',
        fillColor: 'gray',
        fillOpacity: 0.5
      });

      marker.bindPopup(`<b>${state}</b><br>2023 Gun Sales: ${sales}`);
      gunSalesLayer.addLayer(marker);
    } else {
      console.error(`Invalid data for ${state}: Sales=${sales}, Lat=${lat}, Long=${long}`);
    }
  });

  gunSalesLayer.addTo(map); // Add gunSalesLayer to the map
}

    // Define custom icon for the military base marker
  let militaryIcon = L.icon({
    iconUrl: './Images/military_marker.png',
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [15, 30], // Anchor point of the icon
    opacity: 0.1
  });

  // Define custom icon for the hospital marker
  let hospitalIcon = L.icon({
    iconUrl: './Images/hospital.png',
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [15, 30], // Anchor point of the icon
    opacity: 0.1
  });
  
  // Load hospital coordinates JSON file and create custom markers
  d3.json("http://127.0.0.1:5000/api/v1.0/hospitals").then(hospitalData => {
    hospitalData.forEach(hospital => {
        let hospitalMarker = L.marker([hospital.Latitude, hospital.Longitude], { icon: hospitalIcon }).addTo(hospitalMarkers);
        hospitalMarker.bindPopup(`<b>${hospital["Hospital Name"]}</b><br>${hospital.Address}, ${hospital.City}, ${hospital.State}`);
        hospitalMarkers.addLayer(hospitalMarker); // Add marker to the cluster group
    });
  });

// Load military base coordinates JSON file and create clustered markers
d3.json("http://127.0.0.1:5000/api/v1.0/military_bases").then(militaryData => {
  militaryData.forEach(base => {
      let marker = L.marker([base.Latitude, base.Longitude], { icon: militaryIcon });
      marker.bindPopup(`<b>${base["Site Name"]}</b><br>Branch: ${base["Military Branch"]}`);
      militaryMarkers.addLayer(marker); // Add marker to the military cluster group
  });
});

  // Ensure update functions are called when updating map
  document.getElementById('date-select').addEventListener('change', () => {
    updateMap();
    updateGunSalesMap();
  });
