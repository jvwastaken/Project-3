// Load state options from JSON
function loadStateOptions() {
    d3.json("../Resources/cleaned_hospitals.json").then((data) => {
      const states = new Set(data.map(hospital => hospital.Info.State));
      const stateSelect = d3.select("#selDataset");
  
      states.forEach(state => {
        stateSelect.append("option").text(state).attr("value", state);
      });
  
      // Optionally load the first state's hospitals by default
      const firstState = Array.from(states)[0];
      filterHospitalsByState(firstState);
    });
  }
  
// Filter hospitals by state
function filterHospitalsByState(state) {
  d3.json("../Resources/cleaned_hospitals.json").then((data) => {
      const filteredHospitals = data.filter(hospital => hospital.Info.State === state);
    
      const openCount = filteredHospitals.filter(hospital => hospital.Info.Status === "Open").length;
      const helipadCount = filteredHospitals.filter(hospital => hospital.Info.Helipad === "Y").length;
      const traumaCount = filteredHospitals.filter(hospital => hospital.Info.Trauma !== "Not Available").length;
      const totalBeds = filteredHospitals.reduce((sum, hospital) => sum + hospital.Info.Beds, 0);

      let hospitalsDisplay = d3.select('#hospitals-display');
      hospitalsDisplay.html(""); // Clear previous content

      hospitalsDisplay.append("h6").text(`Open Hospitals: ${openCount}`);
      hospitalsDisplay.append("h6").text(`Total Beds: ${totalBeds}`);
      hospitalsDisplay.append("h6").text(`Hospitals with Trauma: ${traumaCount}`);
      hospitalsDisplay.append("h6").text(`Hospitals with Helipad: ${helipadCount}`);
      });
}

  
  // Handle state selection
  function optionChanged(selectedState) {
    filterHospitalsByState(selectedState);
  }
  
  // Initialize the dashboard
  loadStateOptions();
  