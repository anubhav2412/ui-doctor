document.addEventListener("DOMContentLoaded", function () {
    // Replace with the actual endpoint that returns the JSON data
    const apiUrl = "/api/scanResults";

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            // Calculate total metrics
            const totalLibraryTags = sumValues(data.libraryComponents);
            const totalNativeTags = sumValues(data.nativeComponents);
            const totalTags = totalLibraryTags + totalNativeTags;

            const totalLibraryClasses = sumValues(data.libraryClasses);
            const totalNativeClasses = sumValues(data.nativeClasses);
            const totalClasses = totalLibraryClasses + totalNativeClasses;

            // Calculate percentages
            const libraryTagPercentage =
                totalTags === 0 ? 0 : ((totalLibraryTags / totalTags) * 100).toFixed(2);
            const nativeTagPercentage =
                totalTags === 0 ? 0 : ((totalNativeTags / totalTags) * 100).toFixed(2);

            const libraryClassPercentage =
                totalClasses === 0 ? 0 : ((totalLibraryClasses / totalClasses) * 100).toFixed(2);
            const nativeClassPercentage =
                totalClasses === 0 ? 0 : ((totalNativeClasses / totalClasses) * 100).toFixed(2);

            // Calculate unique metrics
            const uniqueLibraryTags = Object.keys(data.libraryComponents).length;
            const uniqueNativeTags = Object.keys(data.nativeComponents).length;
            const uniqueLibraryClasses = Object.keys(data.libraryClasses).length;
            const uniqueNativeClasses = Object.keys(data.nativeClasses).length;

            const totalUniqueTags = uniqueLibraryTags + uniqueNativeTags;
            const totalUniqueClasses = uniqueLibraryClasses + uniqueNativeClasses;

            const uniqueLibraryTagPercentage =
                totalUniqueTags === 0
                    ? 0
                    : ((uniqueLibraryTags / totalUniqueTags) * 100).toFixed(2);
            const uniqueNativeTagPercentage =
                totalUniqueTags === 0
                    ? 0
                    : ((uniqueNativeTags / totalUniqueTags) * 100).toFixed(2);

            const uniqueLibraryClassPercentage =
                totalUniqueClasses === 0
                    ? 0
                    : ((uniqueLibraryClasses / totalUniqueClasses) * 100).toFixed(2);
            const uniqueNativeClassPercentage =
                totalUniqueClasses === 0
                    ? 0
                    : ((uniqueNativeClasses / totalUniqueClasses) * 100).toFixed(2);

            // Update percentages in the DOM
            document.getElementById("libraryTagPercentage").textContent = `${libraryTagPercentage}%`;
            document.getElementById("nativeTagPercentage").textContent = `${nativeTagPercentage}%`;
            document.getElementById("libraryClassPercentage").textContent = `${libraryClassPercentage}%`;
            document.getElementById("nativeClassPercentage").textContent = `${nativeClassPercentage}%`;
            document.getElementById("uniqueLibraryTagPercentage").textContent = `${uniqueLibraryTagPercentage}%`;
            document.getElementById("uniqueNativeTagPercentage").textContent = `${uniqueNativeTagPercentage}%`;
            document.getElementById("uniqueLibraryClassPercentage").textContent = `${uniqueLibraryClassPercentage}%`;
            document.getElementById("uniqueNativeClassPercentage").textContent = `${uniqueNativeClassPercentage}%`;

            // Update totals in the DOM
            document.getElementById("totalLibraryTags").textContent = `Total: ${totalLibraryTags}`;
            document.getElementById("totalNativeTags").textContent = `Total: ${totalNativeTags}`;
            document.getElementById("totalLibraryClasses").textContent = `Total: ${totalLibraryClasses}`;
            document.getElementById("totalNativeClasses").textContent = `Total: ${totalNativeClasses}`;
            document.getElementById("totalUniqueLibraryTags").textContent = `Total: ${uniqueLibraryTags}`;
            document.getElementById("totalUniqueNativeTags").textContent = `Total: ${uniqueNativeTags}`;
            document.getElementById("totalUniqueLibraryClasses").textContent = `Total: ${uniqueLibraryClasses}`;
            document.getElementById("totalUniqueNativeClasses").textContent = `Total: ${uniqueNativeClasses}`;

            // Populate other tables
            populateTable("libraryComponentsTable", data.libraryComponents);
            populateTable("nativeComponentsTable", data.nativeComponents);
            populateTable("libraryClassesTable", data.libraryClasses);
            populateTable("nativeClassesTable", data.nativeClasses);
            populateOverriddenStylesTable("overriddenStylesTable", data.overriddenStyles);
            populateComponentBreakdownTable("componentBreakdownTable", data.componentBreakdown);
        })
        .catch((error) => console.error("Error fetching scan results:", error));
    function populateTable(tableId, data) {
        const tbody = document.getElementById(tableId).querySelector("tbody");
        tbody.innerHTML = ""; // Clear existing rows

        for (const [key, value] of Object.entries(data || {})) {
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

    function populateComponentBreakdownTable(tableId, componentBreakdown) {
        const tbody = document.getElementById(tableId).querySelector("tbody");
        tbody.innerHTML = ""; // Clear existing rows

        for (const [component, details] of Object.entries(componentBreakdown || {})) {
            const row = document.createElement("tr");

            const cellComponent = document.createElement("td");
            cellComponent.textContent = component;

            const cellLibraryTags = document.createElement("td");
            cellLibraryTags.innerHTML = formatList(details.libraryComponents, "tag-list");

            const cellNativeTags = document.createElement("td");
            cellNativeTags.innerHTML = formatList(details.nativeComponents, "tag-list");

            const cellLibraryClasses = document.createElement("td");
            cellLibraryClasses.innerHTML = formatList(details.libraryClasses, "class-list");

            const cellNativeClasses = document.createElement("td");
            cellNativeClasses.innerHTML = formatList(details.nativeClasses, "class-list");

            row.appendChild(cellComponent);
            row.appendChild(cellLibraryTags);
            row.appendChild(cellNativeTags);
            row.appendChild(cellLibraryClasses);
            row.appendChild(cellNativeClasses);

            tbody.appendChild(row);
        }
    }

    function formatList(data, className) {
        if (!data || Object.keys(data).length === 0) return "N/A";

        const ul = document.createElement("ul");
        ul.className = className;

        for (const [key, value] of Object.entries(data)) {
            const li = document.createElement("li");
            li.innerHTML = `<span class="highlight">${key}</span>: ${value}`;
            ul.appendChild(li);
        }

        return ul.outerHTML;
    }
    function populateOverriddenStylesTable(tableId, overriddenStyles) {
        const tbody = document.getElementById(tableId).querySelector("tbody");
        tbody.innerHTML = ""; // Clear existing rows

        for (const [selector, styles] of Object.entries(overriddenStyles || {})) {
            const row = document.createElement("tr");

            const cellSelector = document.createElement("td");
            cellSelector.textContent = selector;

            const cellLibraryStyle = document.createElement("td");
            cellLibraryStyle.innerHTML = formatStyle(styles.library || {});

            const cellCustomStyle = document.createElement("td");
            cellCustomStyle.innerHTML = formatStyle(styles.custom || {});

            row.appendChild(cellSelector);
            row.appendChild(cellLibraryStyle);
            row.appendChild(cellCustomStyle);

            tbody.appendChild(row);
        }
    }

    function formatDetails(details) {
        if (!details || Object.keys(details).length === 0) return "N/A";
        return Object.entries(details)
            .map(([key, value]) => `${key}: ${value}`)
            .join("<br>");
    }

    function formatStyle(style) {
        if (!style || Object.keys(style).length === 0) return "N/A";
        return Object.entries(style)
            .map(([key, value]) => `<b>${key}</b>: ${value}`)
            .join("<br>");
    }
});
function sumValues(data) {
    if (!data || typeof data !== "object") return 0;
    return Object.values(data).reduce((sum, value) => sum + value, 0);
}