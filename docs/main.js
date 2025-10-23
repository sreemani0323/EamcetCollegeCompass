document.addEventListener("DOMContentLoaded", function () {
    // === FIREBASE SETUP (Mandatory for Canvas Environment - currently unused for public API calls) ===
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    if (firebaseConfig) {
        // Placeholder for Firebase/Auth/Firestore imports and initialization
    }

    // === 1. DATA DEFINITIONS & CONFIGURATION ===
    const optionData = {
        branches: [
            { value: "Civil Engineering", text: "Civil Engineering" },
            { value: "Computer Science & Engineering", text: "Computer Science & Engineering" },
            { value: "Electronics & Communication Engineering", text: "Electronics & Communication Engineering" },
            { value: "Electrical & Electronics Engineering", text: "Electrical & Electronics Engineering" },
            { value: "Mechanical Engineering", text: "Mechanical Engineering" },
            { value: "Information Technology", text: "Information Technology" },
            { value: "Artificial Intelligence & Machine Learning", text: "Artificial Intelligence & Machine Learning" },
            { value: "Artificial Intelligence & Data Science", text: "Artificial Intelligence & Data Science" },
            { value: "CSE (Artificial Intelligence)", text: "CSE (Artificial Intelligence)" },
            { value: "CSE (Cyber Security)", text: "CSE (Cyber Security)" },
            { value: "CSE (Data Science)", text: "CSE (Data Science)" },
            { value: "CSE (AI & ML Specialization)", text: "CSE (AI & ML Specialization)" },
            { value: "Chemical Engineering", text: "Chemical Engineering" },
            { value: "Biotechnology", text: "Biotechnology" },
            { value: "Agricultural Engineering", text: "Agricultural Engineering" },
            { value: "Mining Engineering", text: "Mining Engineering" },
            { value: "Metallurgical Engineering", text: "Metallurgical Engineering" },
            { value: "Aerospace Engineering", text: "Aerospace Engineering" },
            { value: "Automobile Engineering", text: "Automobile Engineering" },
            { value: "Internet of Things", text: "Internet of Things" },
            { value: "B.Pharm", text: "B.Pharm" },
            { value: "Doctor of Pharmacy (Pharm.D)", text: "Doctor of Pharmacy (Pharm.D)" },
            { value: "Electronics & Instrumentation Engineering", text: "Electronics & Instrumentation Engineering" },
            { value: "CSE (Business Systems)", text: "CSE (Business Systems)" },
            { value: "Geo-Informatics Engineering", text: "Geo-Informatics Engineering" },
        ],
        quotas: [
            { value: "oc", text: "OC (Open Category)" }, { value: "sc", text: "SC (Scheduled Caste)" }, { value: "st", text: "ST (Scheduled Tribe)" }, { value: "bca", text: "BC-A" }, { value: "bcb", text: "BC-B" }, { value: "bcc", text: "BC-C" }, { value: "bcd", text: "BC-D" }, { value: "bce", text: "BC-E" }, { value: "oc_ews", text: "OC (EWS Quota)" },
        ],
        genders: [ { value: "boys", text: "Boys" }, { value: "girls", text: "Girls" } ],
        // VALUE property uses the FULL NAME for API compatibility
        districts: [
            { value: "Anantapur", text: "Anantapur" }, { value: "Annamayya", text: "Annamayya" }, 
            { value: "Bapatla", text: "Bapatla" }, { value: "Chittoor", text: "Chittoor" }, 
            { value: "East Godavari", text: "East Godavari" }, { value: "Eluru", text: "Eluru" }, 
            { value: "Guntur", text: "Guntur" }, { value: "Kadapa", text: "Kadapa" }, 
            { value: "Krishna", text: "Krishna" }, { value: "Kurnool", text: "Kurnool" }, 
            { value: "Nandyal", text: "Nandyal" }, { value: "Nellore", text: "Nellore" }, 
            { value: "NTR", text: "NTR" }, { value: "Palnadu", text: "Palnadu" }, 
            { value: "Prakasam", text: "Prakasam" }, { value: "Srikakulam", text: "Srikakulam" }, 
            { value: "Tirupati", text: "Tirupati" }, { value: "Visakhapatnam", text: "Visakhapatnam" }, 
            { value: "Vizianagaram", text: "Vizianagaram" }, { value: "West Godavari", text: "West Godavari" }, 
            { value: "YSR Kadapa", text: "YSR Kadapa" }, 
        ],
        regions: [
            { value: "AU", text: "Andhra University Region" }, { value: "SVU", text: "Sri Venkateswara University Region" }, { value: "SW", text: "South-West region" },
        ],
        tiers: [ { value: "Tier 1", text: "Tier 1" }, { value: "Tier 2", text: "Tier 2" }, { value: "Tier 3", text: "Tier 3" } ],
        placementQuality: [
            { value: "Excellent", text: "Excellent" }, { value: "Very Good", text: "Very Good" }, { value: "Good", text: "Good" }, { value: "Bad", text: "Bad" },
        ]
    };

    const regionDistrictMap = {
        // Arrays use FULL DISTRICT NAMES
        "AU": ["Visakhapatnam", "Vizianagaram", "Srikakulam", "East Godavari", "West Godavari", "Eluru", "Bapatla"], 
        "SVU": ["Chittoor", "Kadapa", "Nellore", "Annamayya", "Tirupati", "YSR Kadapa"],
        "SW": ["Anantapur", "Kurnool", "Guntur", "Krishna", "Prakasam", "Nandyal", "NTR", "Palnadu"]
    };

    const translations = {
        btnPredict: "Predict Now", btnClear: "Clear All Filters", disclaimerStrong: "Disclaimer:",
        disclaimerText: "Prediction is based on previous years' cutoff data and trends. Actual cutoffs may vary due to factors such as applicants and seat availability.",
        sortLabel: "Sort By:", selectAll: "Select All", sortProbabilityDesc: "Probability (High to Low)", sortProbabilityAsc: "Probability (Low to High)",
        sortCutoffAsc: "Cutoff Rank (Low to High)", sortCutoffDesc: "Cutoff Rank (High to Low)",
        sortAvgPackageDesc: "Average Package (High to Low)", sortAvgPackageAsc: "Average Package (Low to High)",
        sortHighestPackageDesc: "Highest Package (High to Low)", sortHighestPackageAsc: "Highest Package (Low to High)",
        sortQualityDesc: "Placement Quality (Best to Worst)", sortQualityAsc: "Placement Quality (Worst to Best)",
        btnSavePdf: "Save as PDF", btnSaveCsv: "Save as CSV",
        noDataText: "No colleges found matching your criteria.", noInputText: "Please enter a valid positive rank or select at least one filter.",
        fetchError: "Could not fetch predictions. Please try again later.", itemsSelected: "items selected",
        downloadNoData: "Please predict colleges first to download results.",
        labelBranch: "Branch Preference", selectBranch: "Select Branch",
        labelQuota: "Reservation Quota", selectQuota: "Select Quota",
        labelGender: "Gender", selectGender: "Select Gender",
        labelRegion: "Region", selectRegion: "Select Region",
        labelDistrict: "District", selectDistrict: "Select District",
        labelTier: "College Tier", selectTier: "Select Tier",
        labelPlacementQuality: "Placement Quality", selectQuality: "Select Quality",
        compareCheck: "Compare", compareCount: " Colleges Selected for Comparison",
        compareNow: "Compare Now", clearCompare: "Clear Comparison",
        tableFeature: "Feature", tableName: "College Name", tableBranch: "Branch", tableCutoff: "Cutoff Rank", tableProb: "Predicted Chance", tableTier: "Tier", tableAvg: "Avg. Package (Lakhs)", tableHighest: "Highest Package (Lakhs)", tableQuality: "Placement Quality",
        mapCollegeDetails: "College Details",
        limitWarningTitle: "Comparison Limit Reached",
        limitWarningText: "You can only select up to 4 colleges for side-by-side comparison. Please deselect a college to add a new one.",
        inputWarningTitle: "Input Required",
        inputWarningText: "To get predictions, please enter your EAMCET rank or select at least one filter option."
    };
    
    const SortMap = {
        'probability': { prop: 'probability' }, 'cutoff': { prop: 'cutoff' },
        'avgPackage': { prop: 'averagePackage' }, 'highestPackage': { prop: 'highestPackage' },
        'quality': { prop: 'placementDriveQuality', order: { "Excellent": 4, "Very Good": 3, "Good": 2, "Bad": 1 } }
    };

    // === 2. ELEMENT SELECTORS ===
    const body = document.body;
    const darkModeSwitch = document.getElementById("darkModeSwitch");
    const rankInput = document.getElementById("rank");
    const predictButton = document.getElementById("predictButton");
    const clearButton = document.getElementById("clearButton");
    const predictForm = document.getElementById("predictForm");
    const collegeListDiv = document.getElementById("collegeList");
    const resultsHeader = document.getElementById("resultsHeader");
    const sortBySelect = document.getElementById("sortBy");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const filtersHeader = document.getElementById('filtersHeader');
    const filtersContainer = document.getElementById('filtersContainer');
    const multiselectContainers = document.querySelectorAll('.multiselect-dropdown');
    // REMOVED: const finalCategoryInput = document.getElementById("category"); // No longer needed
    const downloadBtn = document.getElementById("downloadBtn");
    const downloadMenu = document.getElementById("downloadMenu");
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");
    const downloadCsvBtn = document.getElementById("downloadCsvBtn");
    const scrollButtons = document.getElementById("scrollButtons");
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    const scrollBottomBtn = document.getElementById("scrollBottomBtn");
    
    // COMPARISON ELEMENT SELECTORS
    const comparisonTray = document.getElementById('comparison-tray');
    const compareCountSpan = document.getElementById('compare-count');
    const compareNowBtn = document.getElementById('compare-now-btn');
    const clearCompareBtn = document.getElementById('clear-compare-btn');
    const comparisonModal = document.getElementById('comparison-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const comparisonTableContainer = document.getElementById('comparison-table-container');
    
    // WARNING MODAL ELEMENTS
    const warningModal = document.getElementById('custom-warning-modal');
    const warningModalTitle = document.getElementById('warning-modal-title');
    const warningModalText = document.getElementById('warning-modal-text');
    const warningModalCloseBtn = document.getElementById('warning-modal-close-btn');
    
    // NEW ELEMENT SELECTOR for the second button
    const predictButtonBottom = document.getElementById('predictButtonBottom');


    // === 3. STATE VARIABLES ===
    let rawData = [];
    let sortedData = [];
    let selectedColleges = []; 
    let allCollegesCache = []; // Cache for all colleges data

    // === 4. INITIALIZATION ===
    initializePage();

    function initializePage() {
        setTheme(localStorage.getItem("theme") || 'light');
        multiselectContainers.forEach(initializeMultiselect);
        setupEventListeners();
        
        // Check for URL parameters (e.g., from map "View Details" links)
        checkUrlParameters();
        
        // Load any saved results from sessionStorage
        loadSavedResults();
        
        if (rawData.length === 0) {
            renderEmptyState();
        }
        translateUI();
        updateDistrictOptions();
        updatePlacementOptions();
        loadAllCollegesCache(); // Load cache on startup
    }
    
    function checkUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const instcode = urlParams.get('instcode');
        const view = urlParams.get('view');
        
        if (instcode && view === 'details') {
            // Auto-search for this specific college by instcode
            setTimeout(() => {
                // Make API call to filter by instcode
                showSpinner(true);
                fetch("https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ instcode: instcode })
                })
                .then(res => res.json())
                .then(data => {
                    // FIXED: Ensure only the specific college is displayed
                    // The API might return all colleges if the instcode filter isn't working properly
                    // So we filter the data on the client side as well
                    const filteredData = data.filter(college => college.instcode === instcode);
                    rawData = filteredData;
                    filterAndRenderColleges();
                    showSpinner(false);
                    
                    // Clear URL parameters without reload
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch(err => {
                    console.error("Failed to load college details:", err);
                    showSpinner(false);
                });
            }, 100);
        }
    }
    
    function loadSavedResults() {
        const savedData = sessionStorage.getItem('collegeResults');
        const savedSorted = sessionStorage.getItem('sortedResults');
        
        if (savedData && savedSorted) {
            try {
                rawData = JSON.parse(savedData);
                sortedData = JSON.parse(savedSorted);
                if (sortedData.length > 0) {
                    renderColleges();
                    resultsHeader.style.display = 'flex';
                }
            } catch (e) {
                console.error('Failed to load saved results:', e);
            }
        }
    }
    
    function saveResults() {
        sessionStorage.setItem('collegeResults', JSON.stringify(rawData));
        sessionStorage.setItem('sortedResults', JSON.stringify(sortedData));
    }
    
    /**
     * Load all colleges data for caching (used by map, analytics, etc.)
     */
    function loadAllCollegesCache() {
        fetch("https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        })
        .then(res => res.json())
        .then(data => {
            allCollegesCache = data;
            console.log(`Loaded ${allCollegesCache.length} colleges into cache`);
        })
        .catch(err => console.error("Failed to load colleges cache:", err));
    }

    // === 5. CORE LOGIC & HELPER FUNCTIONS ===
    function setTheme(theme) {
        // Set body class
        body.classList.toggle("dark-mode", theme === "dark");
        // Ensure checkbox state matches theme state
        darkModeSwitch.checked = theme === "dark";
        localStorage.setItem("theme", theme);
    }

    function showSpinner(show) {
        loadingSpinner.style.display = show ? "flex" : "none";
    }
    
    // Custom Warning Modal Function
    function showWarningModal(title, text) {
        if (!warningModal) return;
        warningModalTitle.textContent = title;
        warningModalText.textContent = text;
        warningModal.style.display = 'flex';
    }

    function createLocationUrl(collegeName, districtCode) {
        // districtCode is now the full name
        const fullDistrict = districtCode || '';
        const query = encodeURIComponent(`${collegeName}, ${fullDistrict}`);
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }

    // REMOVED: function updateFinalCategory() { ... }

    function multiSort(data, criteria) {
        const [key, direction] = criteria.split("-");
        const sortConfig = SortMap[key];
        if (!sortConfig) return data;
        const directionNum = direction === "desc" ? -1 : 1;
        const prop = sortConfig.prop;
        return [...data].sort((a, b) => {
            let valA = a[prop], valB = b[prop];
            if (sortConfig.order) {
                valA = sortConfig.order[valA] || 0;
                valB = sortConfig.order[valB] || 0;
            }
            if (valA == null) return 1; if (valB == null) return -1;
            if (valA < valB) return -1 * directionNum;
            if (valA > valB) return 1 * directionNum;
            return 0;
        });
    }

    function translateUI() {
        document.querySelectorAll("[data-lang-key]").forEach(el => {
            const key = el.getAttribute("data-lang-key");
            const text = translations[key];
            if (text) {
               // Check if the element is a direct child of a label with select-all-label class
                if (el.tagName === 'SPAN' && el.parentElement.classList.contains('select-all-label')) {
                    el.textContent = text;
                } else {
                    const icon = el.querySelector('i');
                    el.innerHTML = icon ? `${icon.outerHTML} ${text}` : text;
                }
            }
        });
        rankInput.placeholder = "Enter your rank here (e.g., 15000)";
        multiselectContainers.forEach(dropdown => {
            const hiddenInput = document.getElementById(dropdown.getAttribute('data-id'));
            const selectedValues = (hiddenInput?.value || "").split(',').filter(Boolean);
            updateSelectedItemsDisplay(dropdown, selectedValues);
        });
        updateComparisonTray(); 
    }

    // === 6. MULTI-SELECT & DEPENDENT DROPDOWN LOGIC ===
    function updateSelectedItemsDisplay(dropdown, selectedValues) {
        const selectedItemsSpan = dropdown.querySelector(".selected-items");
        let placeholderText = selectedItemsSpan.dataset.originalText;
        if (!placeholderText) {
            selectedItemsSpan.dataset.originalText = selectedItemsSpan.textContent;
            placeholderText = selectedItemsSpan.textContent;
        }
        const placeholderKey = dropdown.getAttribute('data-placeholder-key');
        if (placeholderKey && translations[placeholderKey]) {
            placeholderText = translations[placeholderKey];
        }

        if (selectedValues.length === 0 || !selectedValues[0]) {
            selectedItemsSpan.textContent = placeholderText;
            return;
        }
        
        const dataSourceKey = dropdown.querySelector('.options-list').getAttribute('data-source');
        const dataSource = optionData[dataSourceKey];
        if (!dataSource) return;

        const selectedTexts = selectedValues.map(val => dataSource.find(opt => opt.value === val)?.text || val);
        selectedItemsSpan.textContent = selectedTexts.length === 1 ? selectedTexts[0] : `${selectedTexts.length} ${translations.itemsSelected}`;
    }

    function toggleDropdown(dropdown) {
        document.querySelectorAll('.multiselect-dropdown.open').forEach(openDropdown => {
            if (openDropdown !== dropdown) openDropdown.classList.remove('open');
        });
        dropdown.classList.toggle('open');
    }

    function initializeMultiselect(dropdown) {
        const id = dropdown.getAttribute('data-id');
        const hiddenInput = document.getElementById(id);
        const optionsList = dropdown.querySelector('.options-list');
        const dataSourceKey = optionsList.getAttribute('data-source');
        const data = optionData[dataSourceKey];
        if (!data) return;
        
        const isListStyle = dropdown.getAttribute('data-style') === 'list';

        optionsList.innerHTML = data.map(item => `<label><input type="checkbox" data-text="${item.text}" value="${item.value}" /><span>${item.text}</span></label>`).join('');
        
        dropdown.querySelector('.multiselect-input').addEventListener('click', () => toggleDropdown(dropdown));
        
        const optionElements = optionsList.querySelectorAll('label');
            optionElements.forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            
            label.addEventListener('click', (e) => {
                if (isListStyle) {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            checkbox.addEventListener('change', () => {
                if (dropdown.dataset.singleSelect === 'true' && checkbox.checked) {
                    optionElements.forEach(l => {
                        const cb = l.querySelector('input[type="checkbox"]');
                        if (cb !== checkbox) cb.checked = false;
                    });
                    toggleDropdown(dropdown);
                }
                const selectedValues = Array.from(optionElements).map(l => l.querySelector('input[type="checkbox"]')).filter(cb => cb.checked).map(cb => cb.value);
                hiddenInput.value = selectedValues.join(',');
                updateSelectedItemsDisplay(dropdown, selectedValues);

                // REMOVED: if (id === 'quota' || id === 'gender') updateFinalCategory();
                if (id === 'region') updateDistrictOptions();
                if (id === 'tier') updatePlacementOptions();
            });
        });

        const selectAllCheckbox = dropdown.querySelector('.select-all-checkbox');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', () => {
                optionElements.forEach(l => {
                    const cb = l.querySelector('input[type="checkbox"]');
                    if (!cb.disabled) cb.checked = selectAllCheckbox.checked;
                });
                optionElements[0]?.querySelector('input[type="checkbox"]')?.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }
    
    function updateDependentOptions(controlId, hiddenInputId, allowedValues) {
        const dropdown = document.querySelector(`.multiselect-dropdown[data-id="${controlId}"]`);
        const checkboxes = dropdown.querySelectorAll('.options-list input[type="checkbox"]');
        const hiddenInput = document.getElementById(hiddenInputId);
        let stillSelectedValues = [];
        checkboxes.forEach(checkbox => {
            const isAllowed = allowedValues.has(checkbox.value);
            checkbox.disabled = !isAllowed;
            checkbox.closest('label').classList.toggle('disabled', !isAllowed);
            if (!isAllowed) checkbox.checked = false;
            if (checkbox.checked) stillSelectedValues.push(checkbox.value);
        });
        hiddenInput.value = stillSelectedValues.join(',');
        updateSelectedItemsDisplay(dropdown, stillSelectedValues);
    }

    function updateDistrictOptions() {
        const selectedRegions = (document.getElementById('region').value || "").split(',').filter(Boolean);
        let allowedDistricts = new Set(optionData.districts.map(d => d.value));
        if (selectedRegions.length > 0) {
            allowedDistricts = new Set();
            selectedRegions.forEach(region => regionDistrictMap[region]?.forEach(district => allowedDistricts.add(district)));
        }
        updateDependentOptions('district', 'district', allowedDistricts);
    }

   function updatePlacementOptions() {
    let allowedValues = new Set(['Excellent', 'Very Good', 'Good', 'Bad']);

    updateDependentOptions('placementQualityFilter', 'placementQualityFilter', allowedValues);
}

    // === 7. PREDICTION & RENDERING LOGIC ===
    function handlePrediction(event) {
        event.preventDefault();
        
        // --- Input Validation Check ---
        const rankValue = rankInput.value ? parseInt(rankInput.value, 10) : null;
        
        // Retrieve values directly from their respective hidden inputs
        const branchValue = document.getElementById("desiredBranch").value;
        const quotaValue = document.getElementById("quota").value;
        const genderValue = document.getElementById("gender").value;
        const districtValue = document.getElementById("district").value;
        const regionValue = document.getElementById("region").value;
        const tierValue = document.getElementById("tier").value;
        const placementQualityValue = document.getElementById("placementQualityFilter").value;

        // Check if any filter input has a value
        const filterInputs = [
            branchValue,
            quotaValue,
            genderValue,
            districtValue,
            regionValue,
            tierValue,
            placementQualityValue
        ];
        
        const hasFilters = filterInputs.some(val => val !== null && val !== "" && val !== "null");

        // NEW: Validate rank <= 0 with pop-up
        if (rankValue !== null && rankValue <= 0) {
            showValidationModal(
                ValidationMessages.invalidRank.title,
                ValidationMessages.invalidRank.message,
                ValidationMessages.invalidRank.type
            );
            return;
        }

        // Check if no input at all
        if ((!rankValue || rankValue <= 0) && !hasFilters) {
            showValidationModal(
                ValidationMessages.noInput.title,
                ValidationMessages.noInput.message,
                ValidationMessages.noInput.type
            );
            return;
        }
        // --- END Input Validation Check ---

        showSpinner(true);
        collegeListDiv.innerHTML = '';
        resultsHeader.style.display = 'none';
        
        comparisonModal.style.display = 'none';

        // --- CORRECTED LOGIC: Constructing requestData to match backend expectations ---
        const requestData = {};

        // Only add rank if it's a valid positive number
        if (rankValue && rankValue > 0) {
            requestData.rank = rankValue;
        }
        
        // Only add fields if their values are non-empty strings
        if (branchValue) requestData.branch = branchValue;
        if (districtValue) requestData.district = districtValue;
        if (regionValue) requestData.region = regionValue;
        if (tierValue) requestData.tier = tierValue;
        if (placementQualityValue) requestData.placementQualityFilter = placementQualityValue;

        // CRITICAL FIX: Backend expects 'category' (quota like "oc", "sc") and 'gender' as SEPARATE parameters
        // The backend service's setupFilters() method handles combining them into "oc_boys", "sc_girls", etc.
        if (quotaValue) {
            requestData.category = quotaValue; // Send quota value (e.g., "oc", "sc", "bca")
        }
        if (genderValue) {
            requestData.gender = genderValue; // Send gender value (e.g., "boys", "girls")
        }
        // --- END CORRECTED LOGIC ---

        // Use the reliable POST endpoint for prediction/filtering
        // FIXED: Removed double /api/ - backend has no context-path, just controller @RequestMapping("/api")
        fetch("https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges", {
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(requestData) // Use the correct variable name
        })
        .then(response => { if (!response.ok) throw new Error(`API Error: ${response.statusText}`); return response.json(); })
        .then(data => { rawData = data; filterAndRenderColleges(); })
        .catch(error => { console.error("Fetch Error:", error); renderEmptyState(translations.fetchError); })
        .finally(() => showSpinner(false));
    }

    function filterAndRenderColleges() {
        // Clear any previous comparison selections 
        selectedColleges = [];
        updateComparisonTray();

        sortedData = multiSort(rawData, sortBySelect.value);
        renderColleges();
        saveResults(); // Save results to sessionStorage
    }

    function renderColleges() {
        if (!sortedData || sortedData.length === 0) {
            renderEmptyState(translations.noDataText);
            return;
        }
        resultsHeader.style.display = 'flex';
        collegeListDiv.innerHTML = '';
        
        sortedData.forEach(college => {
            const card = document.createElement("div");
            // Create a unique ID for comparison tracking
            const uniqueId = `${college.instcode}-${college.branch}-${college.category}-${college.cutoff}`; 
            card.className = "college-card";
            card.dataset.id = uniqueId; 
            
            const isSelected = selectedColleges.some(c => c.uniqueId === uniqueId);
            
            // Format data for display
            const collegeName = college.institution_name || college.name || "Unnamed College";
            const locationUrl = createLocationUrl(collegeName, college.district);
            const probClass = college.probability >= 75 ? 'prob-high' : college.probability >= 30 ? 'prob-medium' : 'prob-low';
            const qualityClass = `quality-${(college.placementDriveQuality || 'n/a').replace(/\s+/g, '-')}`;

            // CRITICAL FIX: Use JSON.stringify and then replace double quotes with " for safer HTML embedding
            const collegeDataString = JSON.stringify(college).replace(/"/g, '"'); 

            // Comparison Checkbox HTML (calls global function)
            const comparisonCheckbox = `
                <div class="compare-checkbox-wrapper">
                    <label for="compare-${uniqueId}" title="${translations.compareCheck}">
                        <input type="checkbox" id="compare-${uniqueId}" class="compare-checkbox" data-college='${collegeDataString}' data-unique-id="${uniqueId}" ${isSelected ? 'checked' : ''} onchange="handleCompareCheckbox(event)" />
                        <span>${translations.compareCheck}</span>
                    </label>
                </div>
            `;
            
            const cutoffDisplay = college.cutoff ? college.cutoff.toLocaleString() : 'N/A';
            const avgPackageDisplay = college.averagePackage ? `₹${college.averagePackage.toFixed(2)} Lakhs` : 'N/A';
            const highestPackageDisplay = college.highestPackage ? `₹${college.highestPackage.toFixed(2)} Lakhs` : 'N/A';
            const probabilityDisplay = college.probability ? college.probability.toFixed(0) + '%' : 'N/A';
            const districtText = optionData.districts.find(d => d.value === college.district)?.text || 'N/A';

            card.innerHTML = `
                ${comparisonCheckbox}
                <a href="${locationUrl}" target="_blank" class="card-location-link" title="View on Map">
                    <i class="fa-solid fa-location-dot"></i> <span>Location</span>
                </a>
                <div class="card-content-wrapper">
                    <h3 class="card-title">${collegeName}</h3>
                    <p class="card-branch-info">${college.branch || 'N/A'} <span>(${college.category || 'N/A'})</span></p>
                    <div class="card-details-grid">
                        <div class="card-details-item"><strong>Cutoff Rank (${college.category || 'N/A'})</strong><p>${cutoffDisplay}</p></div>
                        <div class="card-details-item"><strong>Avg. Package</strong><p>${avgPackageDisplay}</p></div>
                        <div class="card-details-item"><strong>Placement Drive Quality</strong><p class="${qualityClass}">${college.placementDriveQuality || 'N/A'}</p></div>
                        <div class="card-details-item"><strong>Predicted Chance</strong><p class="${probClass}">${probabilityDisplay}</p></div>
                        <div class="card-details-item"><strong>Highest Package</strong><p>${highestPackageDisplay}</p></div>
                    </div>
                    <div class="card-footer">
                        <span><strong>Inst. Code:</strong> ${college.instcode || 'N/A'}</span>
                        <span><strong>Location:</strong> ${districtText} (${college.region || 'N/A'})</span>
                        <span><strong>Tier:</strong> ${college.tier || 'N/A'}</span>
                    </div>
                </div>
            `;
            collegeListDiv.appendChild(card);
        });
        
        updateComparisonTray(); 
    }

    function renderEmptyState(message) {
        resultsHeader.style.display = 'none';
        collegeListDiv.innerHTML = `<div class="empty-state"><i class="fas fa-search-location"></i><h2>Your Results Will Appear Here</h2><p>${message || "Enter your rank to see college predictions."}</p></div>`;
    }

    // --- Comparison Feature Logic ---

    // Expose this function globally so it can be called from dynamically injected HTML
    window.handleCompareCheckbox = (event) => {
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

        if (checkbox.checked) {
            if (selectedColleges.length < 4) { 
                if (!selectedColleges.some(c => c.uniqueId === uniqueId)) {
                    selectedColleges.push(collegeData);
                }
            } else {
                checkbox.checked = false;
                showValidationModal(
                    ValidationMessages.comparisonLimit.title,
                    ValidationMessages.comparisonLimit.message,
                    ValidationMessages.comparisonLimit.type
                );
                return;
            }
        } else {
            selectedColleges = selectedColleges.filter(c => c.uniqueId !== uniqueId);
        }
        updateComparisonTray();
    };

    window.removeCollegeFromComparison = (uniqueId) => {
        selectedColleges = selectedColleges.filter(c => c.uniqueId !== uniqueId);
        
        const checkbox = document.getElementById(`compare-${uniqueId}`);
        if (checkbox) checkbox.checked = false;

        if (comparisonModal.style.display === 'flex') {
            if (selectedColleges.length >= 2) {
                openComparisonModal(false); 
            } else {
                comparisonModal.style.display = 'none';
            }
        }
        updateComparisonTray();
    };

    function updateComparisonTray() {
        const count = selectedColleges.length;
        const countText = translations.compareCount;
        
        comparisonTray.querySelector('p').innerHTML = `<span id="compare-count" style="color: var(--color-accent); margin-right: 0.25rem;">${count}</span> ${countText}`;

        comparisonTray.classList.toggle('visible', count > 0);
        
        compareNowBtn.disabled = count < 2;
        compareNowBtn.textContent = translations.compareNow;
    }
    

    function openComparisonModal(isFirstOpen = true) {
        if (selectedColleges.length < 2) return;
        
        if (isFirstOpen) comparisonModal.style.display = 'flex';

        const features = [
            { key: 'name', label: translations.tableName, isName: true },
            { key: 'branch', label: translations.tableBranch },
            { key: 'category', label: translations.labelQuota },
            { key: 'cutoff', label: translations.tableCutoff },
            { key: 'probability', label: translations.tableProb, percent: true, color: true },
            { key: 'tier', label: translations.tableTier },
            { key: 'averagePackage', label: translations.tableAvg, currency: true },
            { key: 'highestPackage', label: translations.tableHighest, currency: true },
            { key: 'placementDriveQuality', label: translations.tableQuality, quality: true },
            { key: 'district', label: translations.labelDistrict, districtCode: true },
        ];

        let tableHTML = `<table class="comparison-table"><thead><tr>`;
        
        // First row: College Name/Remove Button
        tableHTML += `<th class="sticky-feature">${translations.tableFeature}</th>`; 

        selectedColleges.forEach(college => {
            const safeCollegeName = (college.name || 'N/A').replace(/'/g, "'"); 

            tableHTML += `
                <th class="text-center">
                    <span class="college-name-row">${safeCollegeName}</span>
                    <button class="remove-col-btn mt-2" onclick="removeCollegeFromComparison('${college.uniqueId}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </th>
            `;
        });

        tableHTML += `</tr></thead><tbody>`;

        // Data rows
        features.forEach(feature => {
            let row = `<tr><th class="sticky-feature">${feature.label}</th>`;
            
            selectedColleges.forEach(college => {
                let displayValue;
                let className = '';

                let value = college[feature.key] ?? 'N/A';

                if (feature.districtCode) {
                    displayValue = optionData.districts.find(d => d.value === value)?.text || value;
                } else if (feature.currency && typeof value === 'number') {
                    displayValue = `₹${value.toFixed(2)}`;
                } else if (feature.percent && typeof value === 'number') {
                    displayValue = `${value.toFixed(0)}%`;
                    className = value >= 75 ? 'prob-high' : value >= 30 ? 'prob-medium' : 'prob-low';
                } else if (feature.quality) {
                    displayValue = value;
                    className = `quality-${(value || 'n/a').replace(/\s+/g, '-')}`;
                } else if (feature.key === 'category') {
                    // The category field usually contains the quota (e.g., 'OC', 'BC-A')
                    const quotaCode = value.split('_')[0].toUpperCase();
                    // Try to find the full text of the quota from the optionData.quotas
                    const quotaOption = optionData.quotas.find(q => q.value.toUpperCase() === quotaCode || q.text.toUpperCase() === value.toUpperCase());
                    displayValue = quotaOption?.text || value;
                } else if (feature.key === 'cutoff') {
                    displayValue = college.cutoff ? college.cutoff.toLocaleString() : 'N/A';
                } else {
                    displayValue = value;
                }
                
                row += `<td class="${className}">${displayValue}</td>`;
            });
            row += `</tr>`;
            tableHTML += row;
        });

        tableHTML += `</tbody></table>`;
        comparisonTableContainer.innerHTML = tableHTML;
    }
    
    // === 8. EVENT LISTENERS SETUP ===
    function setupEventListeners() {
        // Advanced Filters Toggle (NOT the entire "Refine Your Search")
        const advancedFiltersHeader = document.getElementById("advancedFiltersHeader");
        const advancedFiltersContainer = document.getElementById("advancedFiltersContainer");
        
        if (advancedFiltersHeader && advancedFiltersContainer) {
            advancedFiltersHeader.addEventListener("click", () => {
                advancedFiltersContainer.classList.toggle("is-open");
                const arrow = advancedFiltersHeader.querySelector(".toggle-arrow");
                if (advancedFiltersContainer.classList.contains("is-open")) {
                    arrow.style.transform = "rotate(180deg)";
                } else {
                    arrow.style.transform = "rotate(0deg)";
                }
            });
        }
        
        darkModeSwitch.addEventListener("change", () => setTheme(darkModeSwitch.checked ? "dark" : "light"));
        
        // Attach handlers to all Predict buttons
        predictButton.addEventListener("click", handlePrediction);
        if(predictButtonBottom) predictButtonBottom.addEventListener("click", handlePrediction);

        sortBySelect.addEventListener("change", filterAndRenderColleges);

        // Comparison Modal/Tray Listeners
        compareNowBtn.addEventListener('click', () => openComparisonModal(true));
        clearCompareBtn.addEventListener('click', () => {
            selectedColleges.forEach(c => {
                const checkbox = document.getElementById(`compare-${c.uniqueId}`);
                if (checkbox) checkbox.checked = false;
            });
            selectedColleges = [];
            updateComparisonTray();
        });
        closeModalBtn.addEventListener('click', () => comparisonModal.style.display = 'none');
        comparisonModal.addEventListener('click', (e) => {
            if (e.target === comparisonModal) {
                comparisonModal.style.display = 'none';
            }
        });
        
        // Custom Warning Modal Listener
        if (warningModal) {
            warningModalCloseBtn.addEventListener('click', () => warningModal.style.display = 'none');
            warningModal.addEventListener('click', (e) => {
                if (e.target === warningModal) {
                    warningModal.style.display = 'none';
                }
            });
        }
        
        clearButton.addEventListener("click", () => {
            predictForm.reset();
            rankInput.value = '';
            // Note: The hidden input 'category' is still in the HTML, but now unused in prediction logic. 
            // It's still good practice to clear all hidden inputs that were associated with a state.
            document.querySelectorAll('#predictForm input[type="hidden"]').forEach(input => input.value = '');
            multiselectContainers.forEach(dropdown => {
                dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
                updateSelectedItemsDisplay(dropdown, []);
            });
            updateDistrictOptions();
            updatePlacementOptions();
            renderEmptyState();
            rawData = [];
            sortedData = [];
            
            // Clear comparison on filter reset
            selectedColleges = [];
            updateComparisonTray();
        });
        
        // Download Listeners (No changes)
        downloadBtn.addEventListener('click', () => {
            if (sortedData.length === 0) {
                console.warn(translations.downloadNoData);
                return;
            }
            downloadMenu.style.display = downloadMenu.style.display === 'block' ? 'none' : 'block';
        });

        downloadPdfBtn.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const headers = [["College", "Branch", "Category", "Cutoff", "Chance (%)", "Tier", "Placements"]];
            const body = sortedData.map(c => [
                c.institution_name || c.name, c.branch, c.category, c.cutoff, c.probability, c.tier, c.placementDriveQuality
            ]);
            doc.autoTable({ head: headers, body: body, startY: 10 });
            doc.save('EAMCET_Predictions.pdf');
            downloadMenu.style.display = 'none';
        });

        downloadCsvBtn.addEventListener('click', () => {
            const headers = ["College Name", "Branch", "Category", "Cutoff", "Avg Package", "Highest Package", "Placement Quality", "Chance (%)", "Tier", "Inst. Code", "Location"];
            const rows = sortedData.map(c => [ c.institution_name || c.name, c.branch, c.category, c.cutoff, c.averagePackage, c.highestPackage, c.placementDriveQuality, c.probability, c.tier, c.instcode, `${optionData.districts.find(d=>d.value === c.district)?.text} (${c.region})` ]);
            let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.map(f => `"${String(f || '').replace(/"/g, '""')}"`).join(","))].join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "EAMCET_Predictions.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            downloadMenu.style.display = 'none';
        });

        window.addEventListener('scroll', () => {
            scrollButtons.classList.toggle('visible', window.scrollY > 200);
        });
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0 }));
        scrollBottomBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight }));

        document.addEventListener('click', (e) => {
            multiselectContainers.forEach(dropdown => { if (!dropdown.contains(e.target)) dropdown.classList.remove('open'); });
            if (downloadBtn && !downloadBtn.contains(e.target) && !downloadMenu.contains(e.target)) downloadMenu.style.display = 'none';
        });
    }
});