document.addEventListener("DOMContentLoaded", function () {
    // === BACKGROUND ANIMATION ===
    // No longer needed as we're using CSS-based animations now

    const darkModeSwitch = document.getElementById("darkModeSwitch");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const analyticsContent = document.getElementById("analyticsContent");
    
    // Theme management
    const theme = localStorage.getItem("theme") || 'light';
    document.body.classList.toggle("dark-mode", theme === "dark");
    darkModeSwitch.checked = theme === "dark";
    
    darkModeSwitch.addEventListener("change", () => {
        const newTheme = darkModeSwitch.checked ? "dark" : "light";
        document.body.classList.toggle("dark-mode", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
        
        // Refresh charts with new colors if already loaded
        if (analyticsContent.style.display === "block") {
            loadAnalytics();
        }
    });
    
    // Check if we have cached data in session storage
    const cachedData = sessionStorage.getItem('analyticsData');
    if (cachedData) {
        try {
            const data = JSON.parse(cachedData);
            updateSummaryCards(data);
            renderCharts(data);
            loadingSpinner.style.display = "none";
            analyticsContent.style.display = "block";
        } catch (e) {
            console.error("Failed to parse cached analytics data:", e);
            // Load fresh data if cache is corrupted
            loadAnalytics();
        }
    } else {
        // Auto-load analytics on page load
        loadAnalytics();
    }
    
    function loadAnalytics() {
        loadingSpinner.style.display = "flex";
        loadingSpinner.innerHTML = '<div class="spinner"></div>';
        
        // Check if we have cached data that's not too old (less than 30 minutes)
        const cachedData = localStorage.getItem('analyticsData');
        const cacheTimestamp = localStorage.getItem('analyticsDataTimestamp');
        
        if (cachedData && cacheTimestamp) {
            const ageInMinutes = (Date.now() - parseInt(cacheTimestamp)) / (1000 * 60);
            if (ageInMinutes < 30) { // Cache is valid for 30 minutes
                try {
                    const data = JSON.parse(cachedData);
                    updateSummaryCards(data);
                    renderCharts(data);
                    loadingSpinner.style.display = "none";
                    analyticsContent.style.display = "block";
                    console.log("Loaded analytics data from localStorage cache");
                    return;
                } catch (e) {
                    console.warn("Failed to parse cached analytics data:", e);
                }
            }
        }
        
        // If no valid cache, fetch fresh data
        fetch(`https://theeamcetcollegeprediction-2.onrender.com/api/analytics/summary?_=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
                // Cache the data in localStorage with timestamp
                try {
                    localStorage.setItem('analyticsData', JSON.stringify(data));
                    localStorage.setItem('analyticsDataTimestamp', Date.now().toString());
                } catch (e) {
                    console.warn("Failed to cache analytics data:", e);
                }
                
                updateSummaryCards(data);
                renderCharts(data);
                loadingSpinner.style.display = "none";
                analyticsContent.style.display = "block";
            })
            .catch(err => {
                console.error("Failed to load analytics:", err);
                loadingSpinner.innerHTML = "<p style='color: red;'>Failed to load analytics data</p>";
            });
    }
    
    function updateSummaryCards(data) {
        document.getElementById("totalColleges").textContent = data.totalColleges || 0;
        document.getElementById("totalBranches").textContent = 
            Object.keys(data.collegesByBranch || {}).length;
        document.getElementById("avgPackage").textContent = 
            `₹${(data.avgPackageOverall || 0).toFixed(2)} L`;
    }
    
    function renderCharts(data) {
        const isDark = document.body.classList.contains("dark-mode");
        const textColor = isDark ? '#c9d1d9' : '#2c3e50';
        const gridColor = isDark ? '#30363d' : '#e0e0e0';
        
        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = gridColor;
        
        // Regions Chart
        renderPieChart('regionChart', 
            Object.keys(data.collegesByRegion || {}), 
            Object.values(data.collegesByRegion || {}),
            ['#3498db', '#e74c3c', '#2ecc71']);
        
        // Tier Chart
        renderPieChart('tierChart', 
            Object.keys(data.collegesByTier || {}), 
            Object.values(data.collegesByTier || {}),
            ['#FFD700', '#C0C0C0', '#CD7F32']);
        
        // Top 10 Branches
        const branchEntries = Object.entries(data.collegesByBranch || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        renderBarChart('branchChart', 
            branchEntries.map(e => e[0]), 
            branchEntries.map(e => e[1]));
        
        // Top 10 Package by Branch
        const packageEntries = Object.entries(data.avgPackageByBranch || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        renderBarChart('packageChart', 
            packageEntries.map(e => e[0]), 
            packageEntries.map(e => e[1]),
            '₹ (Lakhs)');
    }
    
    function renderPieChart(canvasId, labels, data, colors) {
        const ctx = document.getElementById(canvasId);
        if (ctx.chart) ctx.chart.destroy();
        
        ctx.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors || [
                        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', 
                        '#9b59b6', '#1abc9c', '#34495e'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }
    
    function renderBarChart(canvasId, labels, data, yLabel = 'Colleges') {
        const ctx = document.getElementById(canvasId);
        if (ctx.chart) ctx.chart.destroy();
        
        ctx.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: yLabel,
                    data: data,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: window.innerWidth < 480 ? 60 : 45,
                            minRotation: window.innerWidth < 480 ? 60 : 45,
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            font: {
                                size: window.innerWidth < 768 ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Expose loadAnalytics function globally for refresh button
    window.loadAnalytics = loadAnalytics;
});