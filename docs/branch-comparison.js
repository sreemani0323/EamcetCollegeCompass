document.addEventListener("DOMContentLoaded", async function () {
    // === BACKGROUND ANIMATION ===
    // Create subtle floating particles for background
    function createBackgroundAnimation() {
        const container = document.getElementById('backgroundAnimation');
        if (!container) return;
        
        // Clear any existing particles
        container.innerHTML = '';
        
        // Create 15 particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random size between 2px and 8px
            const size = Math.random() * 6 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random animation duration between 10s and 25s
            const duration = Math.random() * 15 + 10;
            particle.style.animationDuration = `${duration}s`;
            
            // Random delay
            const delay = Math.random() * 5;
            particle.style.animationDelay = `${delay}s`;
            
            container.appendChild(particle);
        }
    }
    
    // Initialize background animation
    createBackgroundAnimation();

    const darkModeSwitch = document.getElementById("darkModeSwitch");
    const branchSelection = document.getElementById("branchSelection");
    const compareBtn = document.getElementById("compareBtn");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const comparisonResults = document.getElementById("comparisonResults");
    const summaryCards = document.getElementById("summaryCards");
    
    let branches = [];
    let selectedBranches = [];
    let branchData = {};
    
    // Theme
    const theme = localStorage.getItem("theme") || 'light';
    document.body.classList.toggle("dark-mode", theme === "dark");
    darkModeSwitch.checked = theme === "dark";
    darkModeSwitch.addEventListener("change", () => {
        const newTheme = darkModeSwitch.checked ? "dark" : "light";
        document.body.classList.toggle("dark-mode", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    });
    
    // Auto-show branch selection on load
    branchSelection.parentElement.style.display = "block";
    
    // Check if we have cached data in localStorage
    const cachedBranches = localStorage.getItem('branchComparisonBranchesData');
    const cachedColleges = localStorage.getItem('branchComparisonCollegesData');
    const branchesCacheTimestamp = localStorage.getItem('branchComparisonBranchesDataTimestamp');
    const collegesCacheTimestamp = localStorage.getItem('branchComparisonCollegesDataTimestamp');
    
    if (cachedBranches && cachedColleges && branchesCacheTimestamp && collegesCacheTimestamp) {
        const branchesAgeInMinutes = (Date.now() - parseInt(branchesCacheTimestamp)) / (1000 * 60);
        const collegesAgeInMinutes = (Date.now() - parseInt(collegesCacheTimestamp)) / (1000 * 60);
        
        // Cache is valid for 30 minutes for branches and 1 hour for colleges
        if (branchesAgeInMinutes < 30 && collegesAgeInMinutes < 60) {
            try {
                branches = JSON.parse(cachedBranches);
                const allColleges = JSON.parse(cachedColleges);
                console.log(`Loaded ${branches.length} branches and ${allColleges.length} colleges from localStorage cache`);
                
                // Render branch checkboxes
                renderBranchCheckboxes();
                
                loadingSpinner.style.display = "none";
                return;
            } catch (e) {
                console.error("Failed to parse cached branch comparison data:", e);
                // Load fresh data if cache is corrupted
                loadInitialData();
            }
        }
    }
    
    // Load branches and colleges from backend
    loadInitialData();
    
    async function loadInitialData() {
        try {
            loadingSpinner.style.display = "flex";
            loadingSpinner.innerHTML = '<div class="spinner"></div><p>Loading available branches...</p>';
            
            // Check if we have cached branches data that's not too old (less than 30 minutes)
            const cachedBranches = localStorage.getItem('branchComparisonBranchesData');
            const cacheTimestamp = localStorage.getItem('branchComparisonBranchesDataTimestamp');
            
            if (cachedBranches && cacheTimestamp) {
                const ageInMinutes = (Date.now() - parseInt(cacheTimestamp)) / (1000 * 60);
                if (ageInMinutes < 30) { // Cache is valid for 30 minutes
                    try {
                        branches = JSON.parse(cachedBranches);
                        console.log(`Loaded ${branches.length} branches from localStorage cache`);
                        
                        // Render branch checkboxes
                        renderBranchCheckboxes();
                        
                        loadingSpinner.style.display = "none";
                        return;
                    } catch (e) {
                        console.warn("Failed to parse cached branch comparison branches data:", e);
                    }
                }
            }
            
            // If no valid cache, fetch fresh data
            const response = await fetch(`https://theeamcetcollegeprediction-2.onrender.com/api/analytics/branches?_=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error(`Failed to load branches: ${response.status}`);
            }
            
            branches = await response.json();
            console.log(`Loaded ${branches.length} branches from backend:`, branches);
            
            // Cache the branches data in localStorage with timestamp
            try {
                localStorage.setItem('branchComparisonBranchesData', JSON.stringify(branches));
                localStorage.setItem('branchComparisonBranchesDataTimestamp', Date.now().toString());
            } catch (e) {
                console.warn("Failed to cache branch comparison branches data:", e);
            }
            
            if (branches.length === 0) {
                throw new Error('No branches found in database');
            }
            
            // Render branch checkboxes
            renderBranchCheckboxes();
            
            loadingSpinner.style.display = "none";
            
        } catch (err) {
            console.error('Failed to load branches:', err);
            loadingSpinner.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--color-primary); margin-bottom: 1rem;">Failed to Load Branches</h3>
                    <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
                        ${err.message || 'Could not connect to server.'}
                    </p>
                    <button onclick="location.reload()" class="btn-primary">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
            `;
        }
    }
    
    function renderBranchCheckboxes() {
        branches.forEach(branch => {
            const div = document.createElement("div");
            div.className = "branch-checkbox";
            div.innerHTML = `
                <input type="checkbox" id="branch_${branch.replace(/\s+/g, '_')}" value="${branch}" />
                <label for="branch_${branch.replace(/\s+/g, '_')}" style="cursor: pointer; flex: 1;">${branch}</label>
            `;
            
            const checkbox = div.querySelector("input");
            checkbox.addEventListener("change", function() {
                if (this.checked) {
                    selectedBranches.push(branch);
                    // Don't add selected class to container
                } else {
                    selectedBranches = selectedBranches.filter(b => b !== branch);
                    // Don't remove selected class from container
                }
                
                compareBtn.disabled = selectedBranches.length < 2;
                if (selectedBranches.length < 2) {
                    compareBtn.textContent = "Select at least 2 branches";
                } else {
                    compareBtn.innerHTML = `<i class="fas fa-chart-bar"></i> Compare ${selectedBranches.length} Branches`;
                }
            });
            
            branchSelection.appendChild(div);
        });
        
        compareBtn.disabled = true;
        compareBtn.textContent = "Select at least 2 branches";
    }
    
    compareBtn.addEventListener("click", compareBranches);
    
    async function compareBranches() {
        loadingSpinner.style.display = "flex";
        loadingSpinner.innerHTML = '<div class="spinner"></div><p>Loading college data...</p>';
        comparisonResults.style.display = "none";
        branchData = {};
        
        try {
            // Check if we have cached colleges data that's not too old (less than 1 hour)
            const cachedColleges = localStorage.getItem('branchComparisonCollegesData');
            const cacheTimestamp = localStorage.getItem('branchComparisonCollegesDataTimestamp');
            
            let allColleges;
            
            if (cachedColleges && cacheTimestamp) {
                const ageInMinutes = (Date.now() - parseInt(cacheTimestamp)) / (1000 * 60);
                if (ageInMinutes < 60) { // Cache is valid for 1 hour
                    try {
                        allColleges = JSON.parse(cachedColleges);
                        console.log(`Loaded ${allColleges.length} colleges from localStorage cache`);
                    } catch (e) {
                        console.warn("Failed to parse cached colleges data:", e);
                        // Load fresh data if cache is corrupted
                        allColleges = null;
                    }
                }
            }
            
            // If no valid cached data, fetch from backend
            if (!allColleges) {
                console.log('Fetching all colleges data from backend...');
                const response = await fetch(`https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges?_=${new Date().getTime()}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({})
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                allColleges = await response.json();
                console.log(`Fetched ${allColleges.length} colleges from backend`);
                
                // Cache the colleges data in localStorage with timestamp
                try {
                    localStorage.setItem('branchComparisonCollegesData', JSON.stringify(allColleges));
                    localStorage.setItem('branchComparisonCollegesDataTimestamp', Date.now().toString());
                } catch (e) {
                    console.warn("Failed to cache branch comparison colleges data:", e);
                }
            }
            
            // Log a sample college to see the structure
            if (allColleges.length > 0) {
                console.log('Sample college data:', allColleges[0]);
            }
            
            // Calculate stats for each selected branch
            for (const branch of selectedBranches) {
                console.log(`Calculating stats for branch: ${branch}`);
                // Handle both 'branch' and 'branchCode' field names
                const branchColleges = allColleges.filter(c => {
                    const collegeBranch = c.branch || c.branchCode || '';
                    return collegeBranch === branch;
                });
                console.log(`Found ${branchColleges.length} colleges for ${branch}`);
                
                if (branchColleges.length > 0) {
                    const packages = branchColleges
                        .map(c => c.averagePackage)
                        .filter(p => p != null && p > 0);
                    
                    const avgPackage = packages.length > 0 
                        ? packages.reduce((a, b) => a + b, 0) / packages.length 
                        : 0;
                    
                    const maxPackage = packages.length > 0 
                        ? Math.max(...packages) 
                        : 0;
                    
                    const minPackage = packages.length > 0 
                        ? Math.min(...packages) 
                        : 0;
                    
                    branchData[branch] = {
                        totalColleges: branchColleges.length,
                        avgPackage: avgPackage,
                        maxPackage: maxPackage,
                        minPackage: minPackage
                    };
                    console.log(`Stats for ${branch}:`, branchData[branch]);
                } else {
                    console.warn(`No colleges found for branch: ${branch}`);
                    // Log available branch names for debugging
                    const availableBranches = [...new Set(allColleges.map(c => c.branch || c.branchCode).filter(Boolean))];
                    console.log('Available branches in data:', availableBranches.slice(0, 10));
                }
            }
            
            if (Object.keys(branchData).length === 0) {
                throw new Error('No data found for selected branches. Please try different branches.');
            }
            
            console.log('Rendering comparison...');
            renderComparison();
            loadingSpinner.style.display = "none";
            comparisonResults.style.display = "block";
            comparisonResults.scrollIntoView({ behavior: "smooth" });
            
        } catch (err) {
            console.error("Failed to fetch branch data:", err);
            loadingSpinner.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--color-primary); margin-bottom: 1rem;">Failed to Load Comparison</h3>
                    <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
                        ${err.message || 'An error occurred while loading branch comparison data.'}
                    </p>
                    <button onclick="location.reload()" class="btn-primary">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
            `;
        }
    }
    
    function renderComparison() {
        // Summary Cards
        summaryCards.innerHTML = "";
        Object.entries(branchData).forEach(([branch, data]) => {
            const card = document.createElement("div");
            card.className = "chart-container";
            card.style.cssText = "text-align: center;";
            card.innerHTML = `
                <h4 style="color: var(--color-accent); margin-bottom: 1rem;">${branch}</h4>
                <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary); margin: 0.5rem 0;">
                    ${data.totalColleges}
                </div>
                <p style="color: var(--color-text-secondary); margin: 0;">Colleges</p>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
                    <p style="margin: 0.25rem 0; font-weight: 600;">Avg Package: ₹${data.avgPackage.toFixed(2)}L</p>
                    <p style="margin: 0.25rem 0; color: var(--color-text-secondary); font-size: 0.9rem;">
                        Max: ₹${data.maxPackage.toFixed(2)}L
                    </p>
                </div>
            `;
            summaryCards.appendChild(card);
        });
        
        // Charts
        renderCharts();
        
        // Table
        renderTable();
    }
    
    function renderCharts() {
        const isDark = document.body.classList.contains("dark-mode");
        const textColor = isDark ? '#c9d1d9' : '#2c3e50';
        const gridColor = isDark ? '#30363d' : '#e0e0e0';
        
        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = gridColor;
        
        const branchNames = Object.keys(branchData);
        const collegeCounts = branchNames.map(b => branchData[b].totalColleges);
        const avgPackages = branchNames.map(b => branchData[b].avgPackage);
        
        // Colleges Chart
        const collegesCtx = document.getElementById("collegesChart");
        if (collegesCtx.chart) collegesCtx.chart.destroy();
        
        collegesCtx.chart = new Chart(collegesCtx, {
            type: 'bar',
            data: {
                labels: branchNames,
                datasets: [{
                    label: 'Number of Colleges',
                    data: collegeCounts,
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
        
        // Package Chart
        const packageCtx = document.getElementById("packageChart");
        if (packageCtx.chart) packageCtx.chart.destroy();
        
        packageCtx.chart = new Chart(packageCtx, {
            type: 'bar',
            data: {
                labels: branchNames,
                datasets: [{
                    label: 'Average Package (Lakhs)',
                    data: avgPackages,
                    backgroundColor: '#2ecc71',
                    borderColor: '#27ae60',
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
                            callback: value => '₹' + value + 'L',
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
    
    function renderTable() {
        const table = document.getElementById("comparisonTable");
        table.innerHTML = "";
        
        // Define features to compare (similar to home tab)
        const features = [
            { key: 'totalColleges', label: 'Total Colleges' },
            { key: 'avgPackage', label: 'Average Package (₹ Lakhs)', isCurrency: true },
            { key: 'maxPackage', label: 'Highest Package (₹ Lakhs)', isCurrency: true },
            { key: 'minPackage', label: 'Lowest Package (₹ Lakhs)', isCurrency: true }
        ];
        
        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        
        // First column for feature names
        const featureHeader = document.createElement("th");
        featureHeader.textContent = "Feature";
        featureHeader.className = "sticky-feature";
        headerRow.appendChild(featureHeader);
        
        // Columns for each branch
        Object.keys(branchData).forEach(branch => {
            const th = document.createElement("th");
            th.textContent = branch;
            th.className = "text-center";
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement("tbody");
        
        // Add rows for each feature
        features.forEach(feature => {
            const row = document.createElement("tr");
            
            // Feature name cell
            const featureCell = document.createElement("td");
            featureCell.textContent = feature.label;
            featureCell.className = "sticky-feature";
            row.appendChild(featureCell);
            
            // Data cells for each branch
            Object.entries(branchData).forEach(([branch, data]) => {
                const cell = document.createElement("td");
                let value = data[feature.key];
                
                if (feature.isCurrency && typeof value === 'number') {
                    cell.textContent = value.toFixed(2);
                } else if (typeof value === 'number') {
                    cell.textContent = Math.round(value);
                } else {
                    cell.textContent = value;
                }
                
                row.appendChild(cell);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
    }
    
    // Add reload function for refresh button
    function reloadBranchData() {
        // Clear session storage cache
        sessionStorage.removeItem('branchComparisonBranchesData');
        sessionStorage.removeItem('branchComparisonCollegesData');
        
        // Reload the page to get fresh data
        location.reload();
    }
    
    // Expose reload function globally
    window.reloadBranchData = reloadBranchData;
});