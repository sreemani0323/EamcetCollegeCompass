document.addEventListener("DOMContentLoaded", function () {
    const darkModeSwitch = document.getElementById("darkModeSwitch");
    const regionFilter = document.getElementById("regionFilter");
    const tierFilter = document.getElementById("tierFilter");
    const searchBox = document.getElementById("searchBox");
    const searchDropdown = document.getElementById("searchDropdown");
    const searchBtn = document.getElementById("searchBtn");
    const filterBtn = document.getElementById("filterBtn");
    const collegeList = document.getElementById("collegeList");
    const loadingSpinner = document.getElementById("loadingSpinner");
    
    let allColleges = [];
    let map;
    let markers = [];
    let selectedSearchCollege = null;
    
    // Place-based coordinates (Andhra Pradesh cities/towns)
    // More accurate than district-level - uses actual place locations
    const placeCoords = {
        // Visakhapatnam District
        "Visakhapatnam": [17.6868, 83.2185],
        "Vizag": [17.6868, 83.2185],
        "MVP Colony": [17.7231, 83.3012],
        "Gajuwaka": [17.7000, 83.2167],
        "Madhurawada": [17.7833, 83.3833],
        "Duvvada": [17.6333, 83.2167],
        "Anakapalle": [17.6911, 83.0036],
        "Bheemunipatnam": [17.8897, 83.4503],
        "Narsipatnam": [17.6673, 82.6122],
        
        // Vizianagaram District
        "Vizianagaram": [18.1167, 83.4000],
        "Bobbili": [18.5667, 83.3667],
        "Parvathipuram": [18.7833, 83.4333],
        "Salur": [18.5167, 83.2000],
        
        // Srikakulam District
        "Srikakulam": [18.2949, 83.8938],
        "Palasa": [18.7667, 84.4167],
        "Amadalavalasa": [18.4167, 83.9000],
        "Ichchapuram": [19.1167, 84.6833],
        
        // East Godavari District
        "Kakinada": [16.9891, 82.2475],
        "Rajahmundry": [17.0005, 81.8040],
        "Rajamahendravaram": [17.0005, 81.8040],
        "Amalapuram": [16.5782, 82.0076],
        "Tuni": [17.3500, 82.5500],
        "Peddapuram": [17.0770, 82.1376],
        "Rampachodavaram": [17.4423, 81.7774],
        
        // West Godavari District  
        "Eluru": [16.7107, 81.0953],
        "Bhimavaram": [16.5449, 81.5212],
        "S R K R ENGINEERING COLLEGE": [16.5449, 81.5212],  // Add SRKR College location
        "Tadepalligudem": [16.8147, 81.5270],
        "Tanuku": [16.7500, 81.6833],
        "Narsapuram": [16.4333, 81.6833],
        
        // Krishna District
        "Vijayawada": [16.5062, 80.6480],
        "Machilipatnam": [16.1875, 81.1389],
        "Gudivada": [16.4333, 80.9833],
        "Nuzvid": [16.7833, 80.8500],
        "Jaggayyapeta": [16.8933, 80.0978],
        "Mylavaram": [16.6167, 80.6500],
        
        // Guntur District
        "Guntur": [16.3067, 80.4365],
        "Tenali": [16.2428, 80.6425],
        "Narasaraopet": [16.2333, 80.0500],
        "Mangalagiri": [16.4308, 80.5679],
        "Chilakaluripet": [16.0892, 80.1672],
        "Sattenapalle": [16.3953, 80.1514],
        "Bapatla": [15.9043, 80.4677],
        "Repalle": [16.0167, 80.8333],
        
        // Prakasam District
        "Ongole": [15.5057, 80.0499],
        "Chirala": [15.8239, 80.3522],
        "Markapur": [15.7353, 79.2705],
        "Kandukur": [15.2154, 79.9036],
        "Addanki": [15.8111, 79.9736],
        
        // Nellore District
        "Nellore": [14.4426, 79.9865],
        "Gudur": [14.1500, 79.8500],
        "Kavali": [14.9167, 79.9833],
        "Atmakur": [14.5833, 79.6000],
        "Venkatagiri": [13.9667, 79.5833],
        
        // Chittoor District
        "Chittoor": [13.2172, 79.1003],
        "Tirupati": [13.6288, 79.4192],
        "Madanapalle": [13.5503, 78.5029],
        "Puttur": [13.4419, 79.5533],
        "Srikalahasti": [13.7500, 79.7000],
        "Palamaner": [13.2000, 78.7667],
        
        // Kadapa District
        "Kadapa": [14.4673, 78.8242],
        "Cuddapah": [14.4673, 78.8242],
        "Proddatur": [14.7502, 78.5483],
        "Rayachoti": [14.0500, 78.7500],
        "Jammalamadugu": [14.8500, 78.3833],
        
        // Anantapur District
        "Anantapur": [14.6819, 77.6006],
        "Hindupur": [13.8283, 77.4911],
        "Guntakal": [15.1667, 77.3667],
        "Dharmavaram": [14.4144, 77.7211],
        "Tadipatri": [14.9075, 78.0095],
        
        // Kurnool District
        "Kurnool": [15.8281, 78.0373],
        "Nandyal": [15.4769, 78.4830],
        "Adoni": [15.6281, 77.2750],
        "Yemmiganur": [15.7272, 77.4828],
        "Nandikotkur": [15.8667, 78.2667]
    };
    
    // Fallback to district coordinates if place not found
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
    
    // Search box autocomplete
    searchBox.addEventListener('input', function() {
        const query = searchBox.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchDropdown.style.display = 'none';
            return;
        }
        
        const uniqueColleges = new Map();
        allColleges.forEach(c => {
            if (!uniqueColleges.has(c.instcode)) {
                const name = (c.name || '').toLowerCase();
                const place = (c.place || '').toLowerCase();
                if (name.includes(query) || place.includes(query)) {
                    uniqueColleges.set(c.instcode, c);
                }
            }
        });
        
        if (uniqueColleges.size === 0) {
            searchDropdown.style.display = 'none';
            return;
        }
        
        const sortedColleges = Array.from(uniqueColleges.values())
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            .slice(0, 10);
        
        searchDropdown.innerHTML = sortedColleges.map(c => `
            <div class="college-dropdown-item" data-instcode="${c.instcode}" 
                 style="padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid var(--border-light); color: var(--color-text-primary);">
                <strong>${c.name}</strong><br>
                <small style="color: var(--color-text-secondary);">${c.place || 'N/A'} | ${c.district}</small>
            </div>
        `).join('');
        
        searchDropdown.style.display = 'block';
        
        // Add click handlers to dropdown items
        searchDropdown.querySelectorAll('.college-dropdown-item').forEach(item => {
            item.addEventListener('click', function() {
                const instcode = this.getAttribute('data-instcode');
                selectedSearchCollege = uniqueColleges.get(instcode);
                searchBox.value = selectedSearchCollege.name;
                searchDropdown.style.display = 'none';
            });
            
            item.addEventListener('mouseenter', function() {
                this.style.background = 'var(--color-accent-light, #e8f4f8)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
            });
        });
    });
    
    // Search button click
    searchBtn.addEventListener('click', function() {
        if (selectedSearchCollege) {
            // Filter to show only selected college
            displaySingleCollege(selectedSearchCollege);
        } else if (searchBox.value.trim()) {
            // Perform regular filter
            filterAndDisplay();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchBox.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });
    
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
            
            // Debug: Find SRKR colleges
            const srkrColleges = allColleges.filter(c => c.name && c.name.toLowerCase().includes('srkr'));
            console.log('SRKR Colleges found:', srkrColleges);
            
            // Debug: Find colleges with place containing 'bhim'
            const bhimColleges = allColleges.filter(c => c.place && c.place.toLowerCase().includes('bhim'));
            console.log('Colleges with place containing bhim:', bhimColleges);
            
            // Debug: Find all unique places
            const uniquePlaces = [...new Set(allColleges.map(c => c.place).filter(Boolean))];
            console.log('All unique places:', uniquePlaces.filter(p => p.toLowerCase().includes('bhim')));
            
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
        const searchTerm = searchBox.value.toLowerCase().trim();
        
        let filtered = allColleges;
        
        // Filter by region
        if (region) {
            filtered = filtered.filter(c => c.region === region);
        }
        
        // Filter by tier
        if (tier) {
            filtered = filtered.filter(c => c.tier === tier);
        }
        
        // Filter by search term (only if no specific college selected)
        if (searchTerm && !selectedSearchCollege) {
            filtered = filtered.filter(c => {
                const name = (c.name || '').toLowerCase();
                const place = (c.place || '').toLowerCase();
                return name.includes(searchTerm) || place.includes(searchTerm);
            });
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
        // Use PLACE-based coordinates for better accuracy than district-level
        uniqueColleges.forEach(college => {
            // First try to get coordinates by place name
            let coords = placeCoords[college.place];
            
            // If place not found, fallback to district coordinates
            if (!coords) {
                coords = districtCoords[college.district];
                if (!coords) {
                    console.warn(`No coordinates for place: ${college.place} or district: ${college.district}`);
                    return;
                } else {
                    console.log(`Using district coordinates for ${college.name}: ${college.district} -> [${coords[0]}, ${coords[1]}]`);
                }
            } else {
                console.log(`Using place coordinates for ${college.name}: ${college.place} -> [${coords[0]}, ${coords[1]}]`);
            }
            
            // Special debug for SRKR colleges
            if (college.name && college.name.toLowerCase().includes('srkr')) {
                console.log(`SRKR College Debug - Name: ${college.name}, Place: ${college.place}, District: ${college.district}, Coords: [${coords[0]}, ${coords[1]}]`);
            }
            
            const marker = L.marker(coords).addTo(map);
            markers.push(marker);
            
            const popupContent = `
                <div style="max-width: 250px;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #2c3e50;">${college.name}</h4>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem; color: #27ae60;">
                        <i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${college.place || college.district}
                    </p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>District:</strong> ${college.district}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Region:</strong> ${college.region}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Tier:</strong> ${college.tier || 'N/A'}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Code:</strong> ${college.instcode}</p>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        });
        
        // Display all in list
        displayCollegeList(Array.from(uniqueColleges.values()));
        
        // Reset selected search college after filtering
        selectedSearchCollege = null;
    }
    
    function displaySingleCollege(college) {
        // Clear existing markers
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        
        // First try to get coordinates by place name
        let coords = placeCoords[college.place];
        
        // If place not found, fallback to district coordinates
        if (!coords) {
            coords = districtCoords[college.district];
            if (!coords) {
                console.warn(`No coordinates for place: ${college.place} or district: ${college.district}`);
                return;
            } else {
                console.log(`Using district coordinates for ${college.name}: ${college.district} -> [${coords[0]}, ${coords[1]}]`);
            }
        } else {
            console.log(`Using place coordinates for ${college.name}: ${college.place} -> [${coords[0]}, ${coords[1]}]`);
        }
        
        // Special debug for SRKR colleges
        if (college.name && college.name.toLowerCase().includes('srkr')) {
            console.log(`SRKR College Debug - Name: ${college.name}, Place: ${college.place}, District: ${college.district}, Coords: [${coords[0]}, ${coords[1]}]`);
        }
        
        const marker = L.marker(coords).addTo(map);
        markers.push(marker);
        
        const popupContent = `
            <div style="max-width: 250px;">
                <h4 style="margin: 0 0 0.5rem 0; color: #2c3e50;">${college.name}</h4>
                <p style="margin: 0.25rem 0; font-size: 0.9rem; color: #27ae60;">
                    <i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${college.place || college.district}
                </p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>District:</strong> ${college.district}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Region:</strong> ${college.region}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Tier:</strong> ${college.tier || 'N/A'}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Code:</strong> ${college.instcode}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent).openPopup();
        map.setView(coords, 12); // Zoom to college location
        
        // Display only this college in list
        displayCollegeList([college]);
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
        
        // Convert to array and SORT ALPHABETICALLY by college name
        const sortedColleges = Array.from(uniqueColleges.values()).sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        // First try to get coordinates by place name for each college
        sortedColleges.forEach(college => {
            // First try to get coordinates by place name
            let coords = placeCoords[college.place];
            
            // If place not found, fallback to district coordinates
            if (!coords) {
                coords = districtCoords[college.district];
                if (!coords) {
                    console.warn(`No coordinates for place: ${college.place} or district: ${college.district}`);
                    coords = [15.9129, 79.7400]; // Default to center of Andhra Pradesh
                }
            }
            
            const card = document.createElement("div");
            card.className = "college-card";
            card.style.cssText = "background: var(--card-light); padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow); transition: transform 0.3s; position: relative; padding-top: 4rem;";
            
            // Create a unique ID for comparison tracking
            const uniqueId = `${college.instcode}`;
            const isSelected = false; // For map view, we don't persist selections
            
            // Comparison Checkbox HTML
            const comparisonCheckbox = `
                <div class="compare-checkbox-wrapper">
                    <label for="compare-${uniqueId}" title="Compare">
                        <input type="checkbox" id="compare-${uniqueId}" class="compare-checkbox" data-college='${JSON.stringify(college).replace(/"/g, '"')}' data-unique-id="${uniqueId}" ${isSelected ? 'checked' : ''} onchange="handleMapCompareCheckbox(event)" />
                        <span>Compare</span>
                    </label>
                </div>
            `;
            
            card.innerHTML = `
                ${comparisonCheckbox}
                <a href="#" class="card-location-link" onclick="map.setView([${coords[0]}, ${coords[1]}], 12); return false;">
                    <i class="fas fa-map-marker-alt"></i> <span>Location</span>
                </a>
                <div class="card-content-wrapper">
                    <h4 class="map-card-title">${college.name}</h4>
                    <p class="map-card-info">
                        <i class="fas fa-map-marker-alt"></i> ${college.district} (${college.region})
                    </p>
                    <p class="map-card-info">
                        <i class="fas fa-layer-group"></i> ${college.tier || 'N/A'}
                    </p>
                    <p class="map-card-info">
                        <i class="fas fa-code"></i> ${college.instcode}
                    </p>
                    <a href="index.html?instcode=${college.instcode}&view=details" class="btn-primary map-card-button">
                        View Details <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
            
            card.addEventListener("mouseenter", () => {
                card.style.transform = "translateY(-5px)";
            });
            
            card.addEventListener("mouseleave", () => {
                card.style.transform = "translateY(0)";
            });
            
            collegeList.appendChild(card);
        });
        
        // Don't scroll to list automatically - user can scroll if needed
        // collegeList.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    
    // Expose this function globally so it can be called from dynamically injected HTML
    window.handleMapCompareCheckbox = (event) => {
        const checkbox = event.target;
        const uniqueId = checkbox.dataset.uniqueId;
        
        let collegeData;
        try {
            // Decode the string and parse JSON
            const dataString = checkbox.getAttribute('data-college').replace(/"/g, '"');
            collegeData = JSON.parse(dataString);
        } catch (e) {
            console.error("Error parsing college data, preventing selection:", e);
            checkbox.checked = false; 
            return;
        }

        collegeData.uniqueId = uniqueId;

        // For map view, we'll just show an alert since we don't have a persistent comparison tray
        if (checkbox.checked) {
            alert(`Added ${collegeData.name} to comparison. In a full implementation, this would be added to a comparison tray.`);
        }
    };
});
