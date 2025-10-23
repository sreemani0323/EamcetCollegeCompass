document.addEventListener("DOMContentLoaded", async function () {
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
    
    // Load branches from backend
    try {
        loadingSpinner.style.display = "flex";
        loadingSpinner.innerHTML = '<div class="spinner"></div><p>Loading available branches...</p>';
        
        const response = await fetch("https://theeamcetcollegeprediction-2.onrender.com/api/analytics/branches");
        if (!response.ok) {
            throw new Error(`Failed to load branches: ${response.status}`);
        }
        
        branches = await response.json();
        console.log(`Loaded ${branches.length} branches from backend:`, branches);
        
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
                    div.classList.add("selected");
                } else {
                    selectedBranches = selectedBranches.filter(b => b !== branch);
                    div.classList.remove("selected");
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
            // Fetch all colleges data first
            console.log('Fetching all colleges data...');
            const response = await fetch("https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const allColleges = await response.json();
            console.log(`Fetched ${allColleges.length} colleges`);
            
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
                        ticks: { precision: 0 }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
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
                            callback: value => '₹' + value + 'L'
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    function renderTable() {
        const table = document.getElementById("comparisonTable");
        
        let html = `
            <thead>
                <tr>
                    <th>Branch</th>
                    <th>Total Colleges</th>
                    <th>Avg Package</th>
                    <th>Max Package</th>
                    <th>Min Package</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        // Sort by avg package descending
        const sorted = Object.entries(branchData).sort((a, b) => b[1].avgPackage - a[1].avgPackage);
        
        sorted.forEach(([branch, data]) => {
            html += `
                <tr>
                    <td><strong>${branch}</strong></td>
                    <td>${data.totalColleges}</td>
                    <td>₹${data.avgPackage.toFixed(2)} Lakhs</td>
                    <td>₹${data.maxPackage.toFixed(2)} Lakhs</td>
                    <td>₹${data.minPackage.toFixed(2)} Lakhs</td>
                </tr>
            `;
        });
        
        html += '</tbody>';
        table.innerHTML = html;
    }
});
