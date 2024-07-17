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
  
// This is the funciton to filter hospitals by state
function filterHospitalsByState(state) {
  d3.json("../../Vivian/Resources/cleaned_hospitals.json").then((data) => {

      // Filter the hospital data to only include hospitals in the selected state.
      let filteredHospitals = data.filter(hospital => hospital.Info.State === state);

      // Counting
      let openCount = filteredHospitals.filter(hospital => hospital.Info.Status === "Open").length;
      let helipadCount = filteredHospitals.filter(hospital => hospital.Info.Helipad === "Y").length;
      let traumaCount = filteredHospitals.filter(hospital => hospital.Info.Trauma !== "Not Available").length;
      let totalBeds = filteredHospitals.reduce((sum, hospital) => sum + hospital.Info.Beds, 0);

      // This will display the information on the Hospitals info card
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

//This function creates a bar chart based on the state chosen
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

  // Handle state selection
  // This function is called whenever a new state is selected from the dropdown. 
  // It takes the selected state as an argument 
  // and calls filterHospitalsByState with that state to update the displayed data.
  function optionChanged(selectedState) {
    filterHospitalsByState(selectedState);

    buildBarChart(selectedState);
  }
  
  // Initialize the dashboard, loads state options
  loadStateOptions();
  