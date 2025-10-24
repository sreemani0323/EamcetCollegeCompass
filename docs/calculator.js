document.addEventListener("DOMContentLoaded", function () {
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
    const form = document.getElementById("calculatorForm");
    const collegeInput = document.getElementById("collegeName");
    const collegeDropdown = document.getElementById("collegeDropdown");
    const branchSelect = document.getElementById("branch");
    const categorySelect = document.getElementById("category");
    const genderSelect = document.getElementById("gender");
    const probabilitySelect = document.getElementById("probability");
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");
    
    let allColleges = [];
    let selectedCollege = null;
    
    // Theme
    const theme = localStorage.getItem("theme") || 'light';
    document.body.classList.toggle("dark-mode", theme === "dark");
    darkModeSwitch.checked = theme === "dark";
    darkModeSwitch.addEventListener("change", () => {
        const newTheme = darkModeSwitch.checked ? "dark" : "light";
        document.body.classList.toggle("dark-mode", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    });
    
    // Check if we have cached data in session storage
    const cachedData = sessionStorage.getItem('calculatorCollegesData');
    if (cachedData) {
        try {
            const data = JSON.parse(cachedData);
            allColleges = data;
            console.log(`Loaded ${allColleges.length} colleges from cache`);
            loadingDiv.style.display = "none";
        } catch (e) {
            console.error("Failed to parse cached calculator data:", e);
            // Load fresh data if cache is corrupted
            loadColleges();
        }
    } else {
        // Auto-load colleges on page load
        loadColleges();
    }
    
    // Load all colleges
    function loadColleges() {
        loadingDiv.innerHTML = '<div class="spinner"></div>';
        loadingDiv.style.display = "flex";
        
    fetch("https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(data => {
        // Cache the data in session storage
        try {
            sessionStorage.setItem('calculatorCollegesData', JSON.stringify(data));
        } catch (e) {
            console.warn("Failed to cache calculator data:", e);
        }
        
        allColleges = data;
        console.log(`Loaded ${allColleges.length} colleges`);
        loadingDiv.style.display = "none";
    })
    .catch(err => {
        console.error("Failed to load colleges:", err);
        loadingDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">Unable to Load Data</h3>
                <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
                    The backend server is not responding. Please try again later.
                </p>
                <a href="index.html" class="btn-primary" style="display: inline-block; text-decoration: none;">
                    <i class="fas fa-arrow-left"></i> Back to Home
                </a>
            </div>
        `;
    });
}
    
    // College search
    collegeInput.addEventListener("input", function() {
        const query = collegeInput.value.toLowerCase().trim();
        
        if (query.length < 2) {
            collegeDropdown.classList.remove("show");
            return;
        }
        
        const uniqueColleges = new Map();
        allColleges.forEach(c => {
            if (c.name && c.name.toLowerCase().includes(query)) {
                uniqueColleges.set(c.instcode, c);
            }
        });
        
        if (uniqueColleges.size === 0) {
            collegeDropdown.classList.remove("show");
            return;
        }
        
        collegeDropdown.innerHTML = Array.from(uniqueColleges.values())
            .slice(0, 10)
            .map(c => `
                <div class="college-dropdown-item" data-instcode="${c.instcode}">
                    ${c.name} <small>(${c.instcode})</small>
                </div>
            `).join('');
        
        collegeDropdown.classList.add("show");
        
        collegeDropdown.querySelectorAll('.college-dropdown-item').forEach(item => {
            item.addEventListener('click', function() {
                const instcode = this.getAttribute('data-instcode');
                selectedCollege = uniqueColleges.get(instcode);
                collegeInput.value = selectedCollege.name;
                collegeDropdown.classList.remove("show");
                loadBranches(instcode);
            });
        });
    });
    
    // Load branches for selected college
    function loadBranches(instcode) {
        fetch(`https://theeamcetcollegeprediction-2.onrender.com/api/colleges/${instcode}/branches`)
            .then(res => res.json())
            .then(branches => {
                branchSelect.innerHTML = '<option value="">Select Branch</option>' +
                    branches.map(b => `<option value="${b}">${b}</option>`).join('');
            })
            .catch(err => console.error("Failed to load branches:", err));
    }
    
    // Form submission
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        if (!selectedCollege) {
            alert("Please select a college from the dropdown");
            return;
        }
        
        const requestData = {
            instcode: selectedCollege.instcode,
            branch: branchSelect.value,
            category: categorySelect.value + "_" + genderSelect.value,
            desiredProbability: parseFloat(probabilitySelect.value)
        };
        
        loadingDiv.style.display = "flex";
        resultDiv.style.display = "none";
        
        fetch("https://theeamcetcollegeprediction-2.onrender.com/api/reverse-calculator", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        })
        .then(res => res.json())
        .then(data => {
            displayResult(data);
            loadingDiv.style.display = "none";
        })
        .catch(err => {
            console.error("Calculation failed:", err);
            loadingDiv.style.display = "none";
            alert("Failed to calculate. Please check your selections.");
        });
    });
    
    function displayResult(data) {
        const probText = data.probability >= 85 ? "Very High" : 
                        data.probability >= 50 ? "Moderate" : "Ambitious";
        
        resultDiv.innerHTML = `
            <div class="result-card">
                <h2><i class="fas fa-bullseye"></i> Required Rank</h2>
                <div class="rank-number">${data.requiredRank.toLocaleString()}</div>
                <p style="font-size: 1.1rem; margin-top: 1rem;">${data.message}</p>
            </div>
            <div class="result-details">
                <h3 style="margin-bottom: 1rem;"><i class="fas fa-info-circle"></i> Details</h3>
                <table style="width: 100%; text-align: left;">
                    <tr>
                        <td><strong>College:</strong></td>
                        <td>${data.collegeName}</td>
                    </tr>
                    <tr>
                        <td><strong>Branch:</strong></td>
                        <td>${data.branch}</td>
                    </tr>
                    <tr>
                        <td><strong>Cutoff Rank:</strong></td>
                        <td>${data.cutoff.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Desired Chance:</strong></td>
                        <td>${data.probability.toFixed(0)}% (${probText})</td>
                    </tr>
                </table>
                <div style="margin-top: 1.5rem; padding: 1rem; background: #e8f4f8; border-left: 4px solid var(--color-accent); border-radius: 4px;">
                    <p style="margin: 0; color: #2c3e50;">
                        <strong>Note:</strong> This is an estimate based on previous year's cutoffs. 
                        Actual requirements may vary. Always aim 10-15% better than the suggested rank for safety.
                    </p>
                </div>
            </div>
        `;
        resultDiv.style.display = "block";
        resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener("click", function(e) {
        if (!collegeInput.contains(e.target) && !collegeDropdown.contains(e.target)) {
            collegeDropdown.classList.remove("show");
        }
    });
    
    // Expose loadColleges function globally for refresh button
    window.loadColleges = loadColleges;
});