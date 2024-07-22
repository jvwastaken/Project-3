// Make an API call to fetch the COVID-19 data
d3.json("/api/v1.0/covid_cases").then(data => {
    console.log(data);

});