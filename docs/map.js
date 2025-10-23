document.addEventListener("DOMContentLoaded", function () {
    const darkModeSwitch = document.getElementById("darkModeSwitch");
    const regionFilter = document.getElementById("regionFilter");
    const tierFilter = document.getElementById("tierFilter");
    const filterBtn = document.getElementById("filterBtn");
    const collegeList = document.getElementById("collegeList");
    const loadingSpinner = document.getElementById("loadingSpinner");
    
    let allColleges = [];
    let map;
    let markers = [];
    
    // District coordinates (Andhra Pradesh)
    const districtCoords = {
        "Visakhapatnam": [17.6868, 83.2185],
        "Vizianagaram": [18.1167, 83.4000],
        "Srikakulam": [18.2949, 83.8938],
        "East Godavari": [17.0005, 82.2305],
        "West Godavari": [16.7150, 81.1094],
        "Eluru": [16.7107, 81.0953],
        "Krishna": [16.5193, 80.6305],
        "Guntur": [16.3067, 80.4365],
        "Prakasam": [15.6126, 79.5865],
        "Nellore": [14.4426, 79.9865],
        "Chittoor": [13.2172, 79.1003],
        "Kadapa": [14.4673, 78.8242],
        "YSR Kadapa": [14.4673, 78.8242],
        "Anantapur": [14.6819, 77.6006],
        "Kurnool": [15.8281, 78.0373],
        "Annamayya": [13.6288, 79.3848],
        "Tirupati": [13.6288, 79.4192],
        "Bapatla": [15.9043, 80.4677],
        "NTR": [16.5062, 80.6480],
        "Palnadu": [16.1814, 79.9864],
        "Nandyal": [15.4769, 78.4830]
    };
    
    // Theme
    const theme = localStorage.getItem("theme") || 'light';
    document.body.classList.toggle("dark-mode", theme === "dark");
    darkModeSwitch.checked = theme === "dark";
    darkModeSwitch.addEventListener("change", () => {
        const newTheme = darkModeSwitch.checked ? "dark" : "light";
        document.body.classList.toggle("dark-mode", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    });
    
    // Initialize map
    map = L.map('map').setView([15.9129, 79.7400], 7); // Center of Andhra Pradesh
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Auto-load colleges on page load
    loadColleges();
    
    // Load colleges
    function loadColleges() {
        loadingSpinner.innerHTML = '<div class="spinner"></div>';
        loadingSpinner.style.display = "flex";
        collegeList.innerHTML = "";
        
        fetch("https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        })
        .then(res => res.json())
        .then(data => {
            allColleges = data;
            filterAndDisplay();
            loadingSpinner.style.display = "none";
        })
        .catch(err => {
            console.error("Failed to load colleges:", err);
            loadingSpinner.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--color-primary); margin-bottom: 1rem;">Unable to Load Map Data</h3>
                    <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
                        The backend server is not responding. Please ensure the server is running or try again later.
                    </p>
                    <a href="index.html" class="btn-primary" style="display: inline-block; text-decoration: none;">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </a>
                </div>
            `;
        });
    }
    
    filterBtn.addEventListener("click", filterAndDisplay);
    
    function filterAndDisplay() {
        const region = regionFilter.value;
        const tier = tierFilter.value;
        
        let filtered = allColleges;
        
        if (region) {
            filtered = filtered.filter(c => c.region === region);
        }
        
        if (tier) {
            filtered = filtered.filter(c => c.tier === tier);
        }
        
        // Clear existing markers
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        
        // Group by unique college (instcode) to avoid duplicates
        const uniqueColleges = new Map();
        filtered.forEach(college => {
            if (!uniqueColleges.has(college.instcode)) {
                uniqueColleges.set(college.instcode, college);
            }
        });
        
        // Add individual markers for each unique college
        uniqueColleges.forEach(college => {
            const coords = districtCoords[college.district];
            if (!coords) return;
            
            // Add slight random offset to avoid overlapping markers
            const latOffset = (Math.random() - 0.5) * 0.05;
            const lngOffset = (Math.random() - 0.5) * 0.05;
            
            const marker = L.marker([coords[0] + latOffset, coords[1] + lngOffset]).addTo(map);
            markers.push(marker);
            
            const popupContent = `
                <div style="max-width: 250px;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #2c3e50;">${college.name}</h4>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>District:</strong> ${college.district}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Tier:</strong> ${college.tier || 'N/A'}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Code:</strong> ${college.instcode}</p>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        });
        
        // Display all in list
        displayCollegeList(Array.from(uniqueColleges.values()));
    }
    
    function displayCollegeList(colleges, districtName = null) {
        if (districtName) {
            collegeList.innerHTML = `<h3 style="grid-column: 1/-1; color: var(--color-primary);">
                <i class="fas fa-map-marker-alt"></i> Colleges in ${districtName} (${colleges.length})
            </h3>`;
        } else {
            collegeList.innerHTML = `<h3 style="grid-column: 1/-1; color: var(--color-primary);">
                <i class="fas fa-university"></i> All Colleges (${colleges.length})
            </h3>`;
        }
        
        // Group by instcode to get unique colleges
        const uniqueColleges = new Map();
        colleges.forEach(c => {
            if (!uniqueColleges.has(c.instcode)) {
                uniqueColleges.set(c.instcode, c);
            }
        });
        
        uniqueColleges.forEach(college => {
            const card = document.createElement("div");
            card.className = "college-card";
            card.style.cssText = "background: var(--card-light); padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow); transition: transform 0.3s;";
            
            card.innerHTML = `
                <h4 style="margin: 0 0 0.5rem 0; color: var(--color-primary);">${college.name}</h4>
                <p style="margin: 0.25rem 0; color: var(--color-text-secondary);">
                    <i class="fas fa-map-marker-alt"></i> ${college.district} (${college.region})
                </p>
                <p style="margin: 0.25rem 0; color: var(--color-text-secondary);">
                    <i class="fas fa-layer-group"></i> ${college.tier || 'N/A'}
                </p>
                <p style="margin: 0.25rem 0; color: var(--color-text-secondary);">
                    <i class="fas fa-code"></i> ${college.instcode}
                </p>
                <a href="index.html?instcode=${college.instcode}&autoload=true" class="btn-primary" style="margin-top: 1rem; display: inline-block; padding: 0.5rem 1rem; text-decoration: none; font-size: 0.9rem;">
                    View Details <i class="fas fa-arrow-right"></i>
                </a>
            `;
            
            card.addEventListener("mouseenter", () => {
                card.style.transform = "translateY(-5px)";
            });
            
            card.addEventListener("mouseleave", () => {
                card.style.transform = "translateY(0)";
            });
            
            collegeList.appendChild(card);
        });
        
        // Scroll to list
        collegeList.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
});
