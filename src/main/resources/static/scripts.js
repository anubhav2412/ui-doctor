document.addEventListener("DOMContentLoaded", function() {
    // Replace with the actual endpoint that returns the JSON data
    const apiUrl = "/api/scanResults";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Populate percentages
            document.getElementById("libraryTagPercentage").textContent = `${data.libraryTagPercentage}`;
            document.getElementById("libraryClassPercentage").textContent = `${data.libraryClassPercentage}`;

            // Populate tables
            populateTable("libraryComponentsTable", data.libraryComponents);
            populateTable("nativeComponentsTable", data.nativeComponents);
            populateTable("libraryClassesTable", data.libraryClasses);
            populateTable("nativeClassesTable", data.nativeClasses);
        })
        .catch(error => console.error("Error fetching scan results:", error));

    function populateTable(tableId, data) {
        const tbody = document.getElementById(tableId).querySelector("tbody");
        tbody.innerHTML = "";  // Clear existing rows

        for (const [key, value] of Object.entries(data)) {
            const row = document.createElement("tr");
            const cellKey = document.createElement("td");
            const cellValue = document.createElement("td");

            cellKey.textContent = key;
            cellValue.textContent = value;

            row.appendChild(cellKey);
            row.appendChild(cellValue);
            tbody.appendChild(row);
        }
    }
});