// Load state options from cleaned_hospitals.json
function loadStateOptions() {
    d3.json("../Resources/cleaned_hospitals.json").then((data) => {
      let states = new Set(data.map(hospital => hospital.Info.State));
      let stateSelect = d3.select("#selDataset"); 

      // For each unique state, an option element is appended to the select element with the state's name and value.
      states.forEach(state => {
        stateSelect.append("option").text(state).attr("value", state);
      });
  
      // This allows the options to load the first state's hospitals by default
      let firstState = Array.from(states)[0];

      // This calls the function to filter hospitals by state to get their info
      filterHospitalsByState(firstState);
    });
  }
  
// This is the funciton to filter hospitals by state
function filterHospitalsByState(state) {
  d3.json("../Resources/cleaned_hospitals.json").then((data) => {

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

  
  // Handle state selection
  // This function is called whenever a new state is selected from the dropdown. 
  // It takes the selected state as an argument 
  // and calls filterHospitalsByState with that state to update the displayed data.
  function optionChanged(selectedState) {
    filterHospitalsByState(selectedState);
  }
  
  // Initialize the dashboard, loads state options
  loadStateOptions();
  