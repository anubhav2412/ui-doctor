const metricTableMap = {
    'libraryTagPercentage': 'libraryComponentsTable',
    'nativeTagPercentage': 'nativeComponentsTable',
    'libraryClassPercentage': 'libraryClassesTable',
    'nativeClassPercentage': 'nativeClassesTable',
    'uniqueLibraryTagPercentage': 'libraryComponentsTable',
    'uniqueNativeTagPercentage': 'nativeComponentsTable',
    'uniqueLibraryClassPercentage': 'libraryClassesTable',
    'uniqueNativeClassPercentage': 'nativeClassesTable',
    'overriddenStyles': 'overriddenStylesTable'
};

// Add this to your existing DOMContentLoaded event listener
function initializeMetricCardLinks() {
    // Track active elements
    let activeCard = null;
    let activeTable = null;

    // Add click handlers to all metric cards
    document.querySelectorAll('.metric-card').forEach(card => {
        // Find the percentage element inside this card to get its ID
        const percentageEl = card.querySelector('[id$="Percentage"], [id="overriddenStyles"]');
        if (!percentageEl) return;

        const tableId = metricTableMap[percentageEl.id];
        if (!tableId) return;

        // Make the card clickable
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => {
            // Remove active state from previous elements
            if (activeCard) {
                activeCard.classList.remove('active-card');
                activeCard.style.boxShadow = 'none';
            }
            if (activeTable) {
                activeTable.classList.remove('active-table');
                activeTable.style.boxShadow = 'none';
            }

            // Get the corresponding table
            const targetTable = document.getElementById(tableId);
            if (!targetTable) return;

            // If clicking the same card, deactivate everything
            if (activeCard === card) {
                activeCard = null;
                activeTable = null;
                return;
            }

            // Add active state to new elements
            card.classList.add('active-card');
            card.style.boxShadow = '0 0 0 2px #3b82f6';
            targetTable.classList.add('active-table');
            targetTable.style.boxShadow = '0 0 0 2px #3b82f6';

            // Scroll table into view
            targetTable.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Update active elements
            activeCard = card;
            activeTable = targetTable;
        });

        // Add hover effect
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

    // Add CSS for transitions
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

    function updateMetrics(data) {
        // Calculate all metrics
        const {
            totalLibraryTags,
            totalNativeTags,
            totalLibraryClasses,
            totalNativeClasses,
            uniqueLibraryTags,
            uniqueNativeTags,
            uniqueLibraryClasses,
            uniqueNativeClasses,
            overriddenStyles
        } = calculateTotals(data);

        // Calculate percentages
        const metrics = calculatePercentages({
            totalLibraryTags,
            totalNativeTags,
            totalLibraryClasses,
            totalNativeClasses,
            uniqueLibraryTags,
            uniqueNativeTags,
            uniqueLibraryClasses,
            uniqueNativeClasses,
            overriddenStyles
        });
        // Update DOM
        updateDOMElements(metrics);
        console.log(metrics);
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
            overriddenStyles: Object.keys(data.overriddenStyles || {}).length
        };
    }

    function calculatePercentages(totals) {
        const totalTags = totals.totalLibraryTags + totals.totalNativeTags;
        const totalClasses = totals.totalLibraryClasses + totals.totalNativeClasses;
        const totalUniqueTags = totals.uniqueLibraryTags + totals.uniqueNativeTags;
        const totalUniqueClasses = totals.uniqueLibraryClasses + totals.uniqueNativeClasses;


        return {
            libraryTagPercentage: calculatePercentage(totals.totalLibraryTags, totalTags),
            nativeTagPercentage: calculatePercentage(totals.totalNativeTags, totalTags),
            libraryClassPercentage: calculatePercentage(totals.totalLibraryClasses, totalClasses),
            nativeClassPercentage: calculatePercentage(totals.totalNativeClasses, totalClasses),
            uniqueLibraryTagPercentage: calculatePercentage(totals.uniqueLibraryTags, totalUniqueTags),
            uniqueNativeTagPercentage: calculatePercentage(totals.uniqueNativeTags, totalUniqueTags),
            uniqueLibraryClassPercentage: calculatePercentage(totals.uniqueLibraryClasses, totalUniqueClasses),
            uniqueNativeClassPercentage: calculatePercentage(totals.uniqueNativeClasses, totalUniqueClasses),
            overriddenStylesPercentage: calculatePercentage(totals.overriddenStyles, totalClasses) ,// Use totalUniqueTags as it's a more relevant total
            ...totals
        };
    }

    function calculatePercentage(value, total) {
        return total === 0 ? 0 : ((value / total) * 100).toFixed(1);
    }

    function updateDOMElements(metrics) {
        Object.entries(metrics).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                if (key.includes('Percentage')) {
                    element.textContent = value;
                } else {
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
    }

    function populateTable(tableId, data) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (!tbody) return;

        tbody.innerHTML = '';

        // Sort data by count in descending order
        const sortedData = Object.entries(data || {})
            .sort(([, a], [, b]) => b - a);

        sortedData.forEach(([key, value]) => {
            const row = tbody.insertRow();
            const nameCell = row.insertCell(0);
            const countCell = row.insertCell(1);

            nameCell.textContent = key;
            countCell.textContent = value;

            // Add hover effect class
            row.classList.add('table-row-hover');
        });
    }

    function populateComponentBreakdown(tableId, breakdown) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (!tbody) return;

        tbody.innerHTML = '';

        Object.entries(breakdown || {}).forEach(([component, details]) => {
            const row = tbody.insertRow();

            // Component name
            const componentCell = row.insertCell(0);
            componentCell.textContent = component;

            // Library Tags
            const libraryTagsCell = row.insertCell(1);
            libraryTagsCell.innerHTML = formatList(details.libraryComponents);

            // Native Tags
            const nativeTagsCell = row.insertCell(2);
            nativeTagsCell.innerHTML = formatList(details.nativeComponents);

            // Library Classes
            const libraryClassesCell = row.insertCell(3);
            libraryClassesCell.innerHTML = formatList(details.libraryClasses);

            // Native Classes
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

            // Selector
            const selectorCell = row.insertCell(0);
            selectorCell.textContent = selector;

            // Library styles
            const libraryStyleCell = row.insertCell(1);
            libraryStyleCell.innerHTML = formatStyles(details.library);

            // Custom styles
            const customStyleCell = row.insertCell(2);
            customStyleCell.innerHTML = formatStyles(details.custom);

            // Highlight overridden properties
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
        return Object.values(obj).reduce((sum, val) => sum + val, 0);
    }

    function showErrorMessage() {
        const container = document.querySelector('.container');
        if (!container) return;

        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = 'Error loading data. Please try again later.';

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

        // Draw pie slices
        data.forEach(item => {
            const sliceAngle = (2 * Math.PI * item.value) / total;

            // Draw slice
            ctx.beginPath();
            ctx.fillStyle = item.color;
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Calculate label position
            const midAngle = startAngle + sliceAngle / 2;
            const percentage = ((item.value / total) * 100).toFixed(1);

            // Position for label box
            const labelRadius = radius * 0.65;
            const labelX = centerX + Math.cos(midAngle) * labelRadius;
            const labelY = centerY + Math.sin(midAngle) * labelRadius;

            // Draw label box and text
            ctx.save();
            ctx.translate(labelX, labelY);

            // Set up text for measurement
            ctx.font = 'bold 12px Arial';
            const text = `${percentage}%`;
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const boxPadding = 4;
            const boxWidth = textWidth + (boxPadding * 2);
            const boxHeight = 16;

            // Draw black background box - no rotation
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight);

            // Draw white text
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 0, 0);

            ctx.restore();

            startAngle += sliceAngle;
        });

        // Create legend
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

// Then define createPieCharts
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

        try {
            // Create Total Components Chart
            createPieChart(
                'Total Components',
                [
                    { name: 'Library Components', value: sumValues(libraryComponents), color: colorPalette.library.primary },
                    { name: 'Native Components', value: sumValues(nativeComponents), color: colorPalette.native.primary }
                ],
                metricsContainer
            );

            // Create Total Classes Chart
            createPieChart(
                'Total Classes',
                [
                    { name: 'Library Classes', value: sumValues(libraryClasses), color: colorPalette.library.secondary },
                    { name: 'Native Classes', value: sumValues(nativeClasses), color: colorPalette.native.secondary }
                ],
                metricsContainer
            );

            // Create Unique Components Chart
            createPieChart(
                'Unique Components',
                [
                    {
                        name: 'Unique Library Components',
                        value: Object.keys(libraryComponents).length || 0,
                        color: colorPalette.library.tertiary
                    },
                    {
                        name: 'Unique Native Components',
                        value: Object.keys(nativeComponents).length || 0,
                        color: colorPalette.native.tertiary
                    }
                ],
                metricsContainer
            );
        } catch (error) {
            console.error('Error creating charts:', error);
            showErrorMessage('Error creating charts. Please check the console for details.');
        }
    }

// Update the error message function to accept custom messages
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

// Helper function with better error handling
    function sumValues(obj) {
        if (!obj || typeof obj !== 'object') return 0;
        return Object.values(obj).reduce((sum, val) => {
            const numVal = Number(val);
            return sum + (isNaN(numVal) ? 0 : numVal);
        }, 0);
    }

// Update the error message function to accept custom messages
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

// Helper function with better error handling
    function sumValues(obj) {
        if (!obj || typeof obj !== 'object') return 0;
        return Object.values(obj).reduce((sum, val) => {
            const numVal = Number(val);
            return sum + (isNaN(numVal) ? 0 : numVal);
        }, 0);
    }

});