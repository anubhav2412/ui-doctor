
    document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "/api/scanResults";

    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
    updateMetrics(data);
    updateTables(data);
    createPieCharts(data);
    initializeMetricCardLinks();
})
    .catch((error) => {
    console.error("Error fetching scan results:", error);
    showErrorMessage();
});
        const tabs = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and tab contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));

                // Add active class to the clicked tab and the corresponding tab content
                const target = tab.getAttribute('data-tab');
                tab.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });

    // Maps metric element IDs to their corresponding tables
        const metricTableMap = {
            'libraryTagPercentage': 'libraryComponentsTable',
            'nativeTagPercentage': 'nativeComponentsTable',
            'libraryClassPercentage': 'libraryClassesTable',
            'nativeClassPercentage': 'nativeClassesTable',
            'uniqueLibraryTagPercentage': 'libraryComponentsTable',
            'uniqueNativeTagPercentage': 'nativeComponentsTable',
            'uniqueLibraryClassPercentage': 'libraryClassesTable',
            'uniqueNativeClassPercentage': 'nativeClassesTable',
            'overriddenStyles': 'overriddenStylesTable',

            // New mappings for code lines and APIs
            'totalLibraryCodeLines': 'totalLibraryCodeLinesTable',
            'totalLibraryAPIs': 'totalLibraryAPIsTable',

            // If you want total lines of code metrics to link to a specific table:
            'totalLinesOfCode': 'componentBreakdownTable',
            'totalLibraryLinesOfCode': 'totalLibraryCodeLinesTable',

            // If there's a percentage metric for library code (libraryCodePercentage),
            // and you want to link it as well (assuming there's a suitable table):
            'libraryCodePercentage': 'componentBreakdownTable'
        };

    function initializeMetricCardLinks() {
    let activeCard = null;
    let activeTable = null;

    document.querySelectorAll('.metric-card').forEach(card => {
    const percentageEl = card.querySelector('[id$="Percentage"], [id="overriddenStyles"], [id="totalLibraryCodeLines"], [id="totalLibraryAPIs"], [id="totalLinesOfCode"], [id="totalLibraryLinesOfCode"], [id="libraryCodePercentage"]');
    if (!percentageEl) return;

    const tableId = metricTableMap[percentageEl.id];
    // If no tableId, no link to a table
    if (!tableId) return;

    card.style.cursor = 'pointer';

    card.addEventListener('click', () => {
    if (activeCard) {
    activeCard.classList.remove('active-card');
    activeCard.style.boxShadow = 'none';
}
    if (activeTable) {
    activeTable.classList.remove('active-table');
    activeTable.style.boxShadow = 'none';
}

    const targetTable = document.getElementById(tableId);
    if (!targetTable) return;

    if (activeCard === card) {
    activeCard = null;
    activeTable = null;
    return;
}

    card.classList.add('active-card');
    card.style.boxShadow = '0 0 0 2px #3b82f6';
    targetTable.classList.add('active-table');
    targetTable.style.boxShadow = '0 0 0 2px #3b82f6';

    targetTable.scrollIntoView({behavior: 'smooth', block: 'center'});

    activeCard = card;
    activeTable = targetTable;
});

    card.addEventListener('mouseenter', () => {
    if (card !== activeCard) {
    card.style.boxShadow = '0 0 0 2px #93c5fd';
}
});

    card.addEventListener('mouseleave', () => {
    if (card !== activeCard) {
    card.style.boxShadow = 'none';
}
});
});

    const style = document.createElement('style');
    style.textContent = `
            .metric-card {
                transition: box-shadow 0.2s ease-in-out;
            }
            .results-table {
                transition: box-shadow 0.2s ease-in-out;
            }
            .active-card, .active-table {
                transition: box-shadow 0.2s ease-in-out;
            }
        `;
    document.head.appendChild(style);
}

    function updateMetrics(data) {
    const totals = calculateTotals(data);
    const metrics = calculatePercentages(totals);

    // Include raw data directly from service
    metrics.totalLinesOfCode = data.totalLinesOfCode || 0;
    metrics.totalLibraryLinesOfCode = data.totalLibraryLinesOfCode || 0;
    metrics.libraryCodePercentage = data.libraryCodePercentage ? data.libraryCodePercentage.toFixed(1) : 0;

    const allMetrics = {...metrics};
    updateDOMElements(allMetrics);
}

    function calculateTotals(data) {
    return {
    totalLibraryTags: sumValues(data.libraryComponents),
    totalNativeTags: sumValues(data.nativeComponents),
    totalLibraryClasses: sumValues(data.libraryClasses),
    totalNativeClasses: sumValues(data.nativeClasses),
    uniqueLibraryTags: Object.keys(data.libraryComponents || {}).length,
    uniqueNativeTags: Object.keys(data.nativeComponents || {}).length,
    uniqueLibraryClasses: Object.keys(data.libraryClasses || {}).length,
    uniqueNativeClasses: Object.keys(data.nativeClasses || {}).length,
    overriddenStyles: Object.keys(data.overriddenStyles || {}).length,
    totalLibraryCodeLines: sumValues(data.totalLibraryCodeLines),
    totalLibraryAPIs: sumValues(data.totalLibraryAPIs)
};
}

    function calculatePercentages(totals) {
    const totalTags = totals.totalLibraryTags + totals.totalNativeTags;
    const totalClasses = totals.totalLibraryClasses + totals.totalNativeClasses;
    const totalUniqueTags = totals.uniqueLibraryTags + totals.uniqueNativeTags;
    const totalUniqueClasses = totals.uniqueLibraryClasses + totals.uniqueNativeClasses;

    return {
    ...totals,
    libraryTagPercentage: calculatePercentage(totals.totalLibraryTags, totalTags),
    nativeTagPercentage: calculatePercentage(totals.totalNativeTags, totalTags),
    libraryClassPercentage: calculatePercentage(totals.totalLibraryClasses, totalClasses),
    nativeClassPercentage: calculatePercentage(totals.totalNativeClasses, totalClasses),
    uniqueLibraryTagPercentage: calculatePercentage(totals.uniqueLibraryTags, totalUniqueTags),
    uniqueNativeTagPercentage: calculatePercentage(totals.uniqueNativeTags, totalUniqueTags),
    uniqueLibraryClassPercentage: calculatePercentage(totals.uniqueLibraryClasses, totalUniqueClasses),
    uniqueNativeClassPercentage: calculatePercentage(totals.uniqueNativeClasses, totalUniqueClasses)
};
}

    function calculatePercentage(value, total) {
    return total === 0 ? 0 : ((value / total) * 100).toFixed(1);
}
        function initializeMetricCardLinks() {
            let activeCard = null;
            let activeTable = null;

            document.querySelectorAll('.metric-card').forEach(card => {
                // Find the metric element inside the card
                const percentageEl = card.querySelector('[id$="Percentage"], [id="overriddenStyles"], [id="totalLibraryCodeLines"], [id="totalLibraryAPIs"], [id="totalLinesOfCode"], [id="totalLibraryLinesOfCode"], [id="libraryCodePercentage"]');
                if (!percentageEl) return;

                const tableId = metricTableMap[percentageEl.id];
                if (!tableId) return; // If there's no table for this metric, skip linking

                card.style.cursor = 'pointer';

                card.addEventListener('click', () => {
                    const targetTable = document.getElementById(tableId);
                    if (!targetTable) return;

                    // Determine which tab the target table is in
                    // Assuming:
                    // - The metrics are in #metricsTab
                    // - The results are in #resultsTab
                    const metricsTab = document.getElementById('metricsTab');
                    const resultsTab = document.getElementById('resultsTab');

                    // Check if the target table is in resultsTab or metricsTab
                    const isInMetricsTab = metricsTab.contains(targetTable);
                    const isInResultsTab = resultsTab.contains(targetTable);

                    // If the table is in the results tab, switch to that tab
                    if (isInResultsTab) {
                        switchTab('resultsTab');
                    } else if (isInMetricsTab) {
                        switchTab('metricsTab');
                    }

                    // Remove highlights from previously active card/table
                    if (activeCard) {
                        activeCard.classList.remove('active-card');
                        activeCard.style.boxShadow = 'none';
                    }
                    if (activeTable) {
                        activeTable.classList.remove('active-table');
                        activeTable.style.boxShadow = 'none';
                    }

                    // Highlight this card and table
                    card.classList.add('active-card');
                    card.style.boxShadow = '0 0 0 2px #3b82f6';
                    targetTable.classList.add('active-table');
                    targetTable.style.boxShadow = '0 0 0 2px #3b82f6';

                    targetTable.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    activeCard = card;
                    activeTable = targetTable;
                });

                card.addEventListener('mouseenter', () => {
                    if (card !== activeCard) {
                        card.style.boxShadow = '0 0 0 2px #93c5fd';
                    }
                });

                card.addEventListener('mouseleave', () => {
                    if (card !== activeCard) {
                        card.style.boxShadow = 'none';
                    }
                });
            });

            const style = document.createElement('style');
            style.textContent = `
        .metric-card {
            transition: box-shadow 0.2s ease-in-out;
        }
        .results-table {
            transition: box-shadow 0.2s ease-in-out;
        }
        .active-card, .active-table {
            transition: box-shadow 0.2s ease-in-out;
        }
    `;
            document.head.appendChild(style);
        }

// Helper function to switch tabs
        function switchTab(tabId) {
            const tabs = document.querySelectorAll('.tab-link');
            const tabContents = document.querySelectorAll('.tab-content');

            // Remove active from all tabs/contents
            tabs.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Activate the requested tab
            const targetTabButton = [...tabs].find(t => t.dataset.tab === tabId);
            const targetTabContent = document.getElementById(tabId);

            if (targetTabButton && targetTabContent) {
                targetTabButton.classList.add('active');
                targetTabContent.classList.add('active');
            }
        }
    function updateDOMElements(metrics) {
    Object.entries(metrics).forEach(([key, value]) => {
    const element = document.getElementById(key);
    if (element) {
    if (key.includes('Percentage') || key === 'libraryCodePercentage') {
    element.textContent = value;
} else {
    // For totals, show "Total: X"
    element.textContent = `Total: ${value}`;
}
}
});
}

    function updateTables(data) {
    populateTable('libraryComponentsTable', data.libraryComponents);
    populateTable('nativeComponentsTable', data.nativeComponents);
    populateTable('libraryClassesTable', data.libraryClasses);
    populateTable('nativeClassesTable', data.nativeClasses);
    populateComponentBreakdown('componentBreakdownTable', data.componentBreakdown);
    populateOverriddenStyles('overriddenStylesTable', data.overriddenStyles);
    populateTable('totalLibraryCodeLinesTable', data.totalLibraryCodeLines);
    populateTable('totalLibraryAPIsTable', data.totalLibraryAPIs);
    populateComponentDetails('componentLibraryCodeLinesTable', data.componentLibraryCodeLines);
    populateComponentDetails('componentLibraryAPIsTable', data.componentLibraryAPIs);
}

    function populateTable(tableId, data) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    tbody.innerHTML = '';

    const sortedData = Object.entries(data || {})
    .sort(([, a], [, b]) => b - a);

    sortedData.forEach(([key, value]) => {
    const row = tbody.insertRow();
    const nameCell = row.insertCell(0);
    const countCell = row.insertCell(1);

    nameCell.textContent = key;
    countCell.textContent = value;
    row.classList.add('table-row-hover');
});
}

    function populateComponentDetails(tableId, data) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    tbody.innerHTML = '';

    Object.entries(data || {}).forEach(([component, details]) => {
    const row = tbody.insertRow();
    const compCell = row.insertCell(0);
    const detailsCell = row.insertCell(1);

    compCell.textContent = component;
    if (!details || Object.keys(details).length === 0) {
    detailsCell.innerHTML = '<span class="empty-list">None</span>';
} else {
    detailsCell.innerHTML = Object.entries(details)
    .map(([key, val]) => `<div class="list-item"><span class="highlight">${key}</span>: ${val}</div>`)
    .join('');
}
});
}

    function populateComponentBreakdown(tableId, breakdown) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    tbody.innerHTML = '';

    Object.entries(breakdown || {}).forEach(([component, details]) => {
    const row = tbody.insertRow();

    const componentCell = row.insertCell(0);
    componentCell.textContent = component;

    const libraryTagsCell = row.insertCell(1);
    libraryTagsCell.innerHTML = formatList(details.libraryComponents);

    const nativeTagsCell = row.insertCell(2);
    nativeTagsCell.innerHTML = formatList(details.nativeComponents);

    const libraryClassesCell = row.insertCell(3);
    libraryClassesCell.innerHTML = formatList(details.libraryClasses);

    const nativeClassesCell = row.insertCell(4);
    nativeClassesCell.innerHTML = formatList(details.nativeClasses);
});
}

    function populateOverriddenStyles(tableId, styles) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    tbody.innerHTML = '';

    Object.entries(styles || {}).forEach(([selector, details]) => {
    const row = tbody.insertRow();

    const selectorCell = row.insertCell(0);
    selectorCell.textContent = selector;

    const libraryStyleCell = row.insertCell(1);
    libraryStyleCell.innerHTML = formatStyles(details.library);

    const customStyleCell = row.insertCell(2);
    customStyleCell.innerHTML = formatStyles(details.custom);

    highlightOverrides(libraryStyleCell, customStyleCell);
});
}

    function formatList(data) {
    if (!data || Object.keys(data).length === 0) {
    return '<span class="empty-list">None</span>';
}

    return Object.entries(data)
    .map(([key, value]) => `
                <div class="list-item">
                    <span class="highlight">${key}</span>: ${value}
                </div>
            `).join('');
}

    function formatStyles(styles) {
    if (!styles || Object.keys(styles).length === 0) {
    return '<span class="empty-list">No styles</span>';
}

    return Object.entries(styles)
    .map(([property, value]) => `
                <div class="style-item">
                    <span class="style-property">${property}:</span> 
                    <span class="style-value">${value}</span>
                </div>
            `).join('');
}

    function highlightOverrides(libraryCell, customCell) {
    const libraryStyles = libraryCell.querySelectorAll('.style-property');
    const customStyles = customCell.querySelectorAll('.style-property');

    customStyles.forEach(customStyle => {
    const property = customStyle.textContent;
    libraryStyles.forEach(libraryStyle => {
    if (libraryStyle.textContent === property) {
    customStyle.parentElement.classList.add('overridden');
}
});
});
}

    function sumValues(obj) {
    if (!obj || typeof obj !== 'object') return 0;
    return Object.values(obj).reduce((sum, val) => {
    const numVal = Number(val);
    return sum + (isNaN(numVal) ? 0 : numVal);
}, 0);
}

    function showErrorMessage(message = 'Error loading data. Please try again later.') {
    const container = document.querySelector('.container');
    if (!container) return;

    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;

    const existingError = container.querySelector('.error-message');
    if (existingError) {
    existingError.remove();
}

    container.insertBefore(error, container.firstChild);
}

    function createPieChart(title, data, container) {
    const chartSection = document.createElement('div');
    chartSection.className = 'chart-section';

    const titleEl = document.createElement('h3');
    titleEl.className = 'chart-title';
    titleEl.textContent = title;
    chartSection.appendChild(titleEl);

    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = -0.5 * Math.PI;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    data.forEach(item => {
    const sliceAngle = (2 * Math.PI * item.value) / total;

    ctx.beginPath();
    ctx.fillStyle = item.color;
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();

    const midAngle = startAngle + sliceAngle / 2;
    const percentage = ((item.value / total) * 100).toFixed(1);

    const labelRadius = radius * 0.65;
    const labelX = centerX + Math.cos(midAngle) * labelRadius;
    const labelY = centerY + Math.sin(midAngle) * labelRadius;

    ctx.save();
    ctx.translate(labelX, labelY);
    ctx.font = 'bold 12px Arial';
    const text = `${percentage}%`;
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const boxPadding = 4;
    const boxWidth = textWidth + (boxPadding * 2);
    const boxHeight = 16;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);

    ctx.restore();

    startAngle += sliceAngle;
});

    const legend = document.createElement('div');
    legend.className = 'chart-legend';

    data.forEach(item => {
    const percentage = ((item.value / total) * 100).toFixed(1);
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
                <span class="legend-color" style="background-color: ${item.color}"></span>
                <span class="legend-label">${item.name}</span>
                <span class="legend-value">${item.value.toLocaleString()} (${percentage}%)</span>
            `;
    legend.appendChild(legendItem);
});

    chartSection.appendChild(canvas);
    chartSection.appendChild(legend);
    container.appendChild(chartSection);
}
        function createPieCharts(data) {
            if (!data || typeof data !== 'object') {
                console.error('Invalid data format');
                return;
            }

            const metricsContainer = document.createElement('div');
            metricsContainer.className = 'charts-grid';

            const metricsGrid = document.querySelector('.metrics-grid');
            metricsGrid.after(metricsContainer);

            const colorPalette = {
                library: {
                    primary: '#0284c7',
                    secondary: '#0369a1',
                    tertiary: '#0C4A6E'
                },
                native: {
                    primary: '#059669',
                    secondary: '#047857',
                    tertiary: '#064E3B'
                }
            };

            const libraryComponents = data.libraryComponents || {};
            const nativeComponents = data.nativeComponents || {};
            const libraryClasses = data.libraryClasses || {};
            const nativeClasses = data.nativeClasses || {};

            const totalLibraryTags = sumValues(libraryComponents);
            const totalNativeTags = sumValues(nativeComponents);
            const totalLibraryClasses = sumValues(libraryClasses);
            const totalNativeClasses = sumValues(nativeClasses);

            const uniqueLibraryComponents = Object.keys(libraryComponents).length || 0;
            const uniqueNativeComponents = Object.keys(nativeComponents).length || 0;
            const uniqueLibraryClsCount = Object.keys(libraryClasses).length || 0;
            const uniqueNativeClsCount = Object.keys(nativeClasses).length || 0;

            const totalLinesOfCode = data.totalLinesOfCode || 0;
            const totalLibraryLinesOfCode = data.totalLibraryLinesOfCode || 0;
            const nonLibraryLinesOfCode = totalLinesOfCode - totalLibraryLinesOfCode;

            try {
                // Total Components Pie
                createPieChart(
                    'Total Components',
                    [
                        { name: 'Library Components', value: totalLibraryTags, color: colorPalette.library.primary },
                        { name: 'Native Components', value: totalNativeTags, color: colorPalette.native.primary }
                    ],
                    metricsContainer
                );

                // Total Classes Pie
                createPieChart(
                    'Total Classes',
                    [
                        { name: 'Library Classes', value: totalLibraryClasses, color: colorPalette.library.secondary },
                        { name: 'Native Classes', value: totalNativeClasses, color: colorPalette.native.secondary }
                    ],
                    metricsContainer
                );

                // Unique Components Pie
                createPieChart(
                    'Unique Components',
                    [
                        { name: 'Unique Library Components', value: uniqueLibraryComponents, color: colorPalette.library.tertiary },
                        { name: 'Unique Native Components', value: uniqueNativeComponents, color: colorPalette.native.tertiary }
                    ],
                    metricsContainer
                );

                // Unique Classes Pie
                createPieChart(
                    'Unique Classes',
                    [
                        { name: 'Unique Library Classes', value: uniqueLibraryClsCount, color: colorPalette.library.primary },
                        { name: 'Unique Native Classes', value: uniqueNativeClsCount, color: colorPalette.native.primary }
                    ],
                    metricsContainer
                );

                // Lines of Code Pie (Library vs Other)
                createPieChart(
                    'Lines of Code',
                    [
                        { name: 'Library Lines', value: totalLibraryLinesOfCode, color: colorPalette.library.secondary },
                        { name: 'Other Lines', value: nonLibraryLinesOfCode, color: colorPalette.native.secondary }
                    ],
                    metricsContainer
                );

                // Each call to createPieChart will automatically generate a legend
                // based on the data passed to it.
            } catch (error) {
                console.error('Error creating charts:', error);
                showErrorMessage('Error creating charts. Please check the console for details.');
            }
        }
});
