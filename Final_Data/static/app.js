document.addEventListener('DOMContentLoaded', function() {
    const routes = JSON.parse(document.getElementById('routes-data').textContent);
    const routesList = document.getElementById('routes');

    routes.forEach(route => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = "#";
        link.textContent = route;
        link.onclick = () => fetchData(route);
        listItem.appendChild(link);
        routesList.appendChild(listItem);
    });

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('result').innerText = 'Error fetching data: ' + error;
        }
    }

    function displayData(data) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    }
});
