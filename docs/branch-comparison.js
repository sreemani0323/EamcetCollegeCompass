document.addEventListener("DOMContentLoaded", function () {
    const darkModeSwitch = document.getElementById("darkModeSwitch");
    const branchSelection = document.getElementById("branchSelection");
    const compareBtn = document.getElementById("compareBtn");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const comparisonResults = document.getElementById("comparisonResults");
    const summaryCards = document.getElementById("summaryCards");
    
    const branches = [
        "Civil Engineering",
        "Computer Science & Engineering",
        "Electronics & Communication Engineering",
        "Electrical & Electronics Engineering",
        "Mechanical Engineering",
        "Information Technology",
        "Artificial Intelligence & Machine Learning",
        "Artificial Intelligence & Data Science",
        "CSE (Artificial Intelligence)",
        "CSE (Cyber Security)",
        "CSE (Data Science)",
        "Chemical Engineering",
        "Biotechnology"
    ];
    
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
    
    // Render branch checkboxes
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
    
    compareBtn.addEventListener("click", compareBranches);
    
    async function compareBranches() {
        loadingSpinner.style.display = "flex";
        comparisonResults.style.display = "none";
        branchData = {};
        
        try {
            // Fetch stats for each selected branch
            for (const branch of selectedBranches) {
                const response = await fetch(`https://theeamcetcollegeprediction-2.onrender.com/api/analytics/branch-stats/${encodeURIComponent(branch)}`);
                const data = await response.json();
                branchData[branch] = data;
            }
            
            renderComparison();
            loadingSpinner.style.display = "none";
            comparisonResults.style.display = "block";
            comparisonResults.scrollIntoView({ behavior: "smooth" });
            
        } catch (err) {
            console.error("Failed to fetch branch data:", err);
            loadingSpinner.innerHTML = "<p style='color: red;'>Failed to load comparison data</p>";
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
