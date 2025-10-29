/**
 * Main JavaScript file for the College Predictor frontend application.
 * Contains the core functionality for the college prediction interface,
 * including form handling, API communication, result rendering, and UI interactions.
 * 
 * This file handles:
 * - DOM initialization and event binding
 * - Form submission and validation
 * - API communication with the backend
 * - Result processing and display
 * - Multiselect dropdown functionality
 * - Theme management (light/dark mode)
 * - Comparison features
 * - Sorting and filtering of results
 */

document.addEventListener("DOMContentLoaded", function () {

    /**
     * Toggles the mobile navigation menu visibility.
     */
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });

        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !navToggle.contains(event.target)) {
                mainNav.classList.remove('active');
            }
        });
    }

    /**
     * Configuration data for various form options and selections.
     * Contains predefined lists for branches, quotas, genders, districts, regions, tiers, and placement qualities.
     */
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    if (firebaseConfig) {
        // Firebase initialization would go here if needed
    }

    /**
     * Static data for form options and selections.
     */
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

    /**
     * Mapping of regions to their corresponding districts.
     * Used to filter district options based on selected regions.
     */
    const regionDistrictMap = {
        "AU": ["Visakhapatnam", "Vizianagaram", "Srikakulam", "East Godavari", "West Godavari", "Eluru", "Bapatla"], 
        "SVU": ["Chittoor", "Kadapa", "Nellore", "Annamayya", "Tirupati", "YSR Kadapa"],
        "SW": ["Anantapur", "Kurnool", "Guntur", "Krishna", "Prakasam", "Nandyal", "NTR", "Palnadu"]
    };

    /**
     * Translation strings for UI elements.
     * Used to support potential internationalization.
     */
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
    
    /**
     * Configuration for sorting options.
     * Maps UI sort options to their corresponding data properties and ordering logic.
     */
    const SortMap = {
        'probability': { prop: 'probability' }, 'cutoff': { prop: 'cutoff' },
        'avgPackage': { prop: 'averagePackage' }, 'highestPackage': { prop: 'highestPackage' },
        'quality': { prop: 'placementDriveQuality', order: { "Excellent": 4, "Very Good": 3, "Good": 2, "Bad": 1 } }
    };

    // DOM element references
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

    const downloadBtn = document.getElementById("downloadBtn");
    const downloadMenu = document.getElementById("downloadMenu");
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");
    const downloadCsvBtn = document.getElementById("downloadCsvBtn");
    const scrollButtons = document.getElementById("scrollButtons");
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    const scrollBottomBtn = document.getElementById("scrollBottomBtn");

    const comparisonTray = document.getElementById('comparison-tray');
    const compareCountSpan = document.getElementById('compare-count');
    const compareNowBtn = document.getElementById('compare-now-btn');
    const clearCompareBtn = document.getElementById('clear-compare-btn');
    const comparisonModal = document.getElementById('comparison-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const comparisonTableContainer = document.getElementById('comparison-table-container');

    const warningModal = document.getElementById('custom-warning-modal');
    const warningModalTitle = document.getElementById('warning-modal-title');
    const warningModalText = document.getElementById('warning-modal-text');
    const warningModalCloseBtn = document.getElementById('warning-modal-close-btn');

    const predictButtonBottom = document.getElementById('predictButtonBottom');

    // Application state variables
    let rawData = [];
    let sortedData = [];
    let selectedColleges = []; 
    let allCollegesCache = []; // Cache for all colleges data

    /**
     * Initializes the page by setting up theme, multiselects, and event listeners.
     */
    initializePage();

    let isPageActive = true;
    let navigationFlag = false;
    let isRefresh = false;

    const pageState = sessionStorage.getItem('mainPageState');
    if (pageState === 'loaded') {
        isRefresh = true;
    }
    sessionStorage.setItem('mainPageState', 'loaded');

    window.addEventListener('beforeunload', function() {
        if (!isRefresh) {
            sessionStorage.setItem('mainPageNavigation', 'true');
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        const navFlag = sessionStorage.getItem('mainPageNavigation');
        if (navFlag) {
            navigationFlag = true;
            sessionStorage.removeItem('mainPageNavigation');
        }
    });

    document.addEventListener('visibilitychange', function() {
        // Visibility change handling would go here if needed
    });

    window.addEventListener('blur', function() {
        // Blur handling would go here if needed
    });

    window.addEventListener('focus', function() {
        // Focus handling would go here if needed
    });

    /**
     * Initializes the page by setting up theme, multiselects, and event listeners.
     */
    function initializePage() {
        console.log('initializePage called');
        setTheme(localStorage.getItem("theme") || 'light');
        multiselectContainers.forEach(initializeMultiselect);
        setupEventListeners();

        if (rankInput) {
            rankInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    console.log('Enter key pressed in rank input, triggering prediction');
                    handlePrediction();
                }
            });

            rankInput.addEventListener('input', function(e) {
                const value = e.target.value;

                if (value && !/^[0-9]*$/.test(value)) {
                    e.target.value = value.replace(/[^0-9]/g, '');
                    return;
                }

                const numValue = parseInt(value) || 0;

                if (numValue > 350000) {
                    console.log('Rank value exceeds 350000:', numValue);

                    if (typeof showValidationModal === 'function') {
                        console.log('Showing validation modal');
                        showValidationModal(
                            'Invalid Rank',
                            'Please enter a rank between 1 and 350000.',
                            'error'
                        );
                    } else {
                        console.log('Showing alert');
                        alert('Please enter a rank between 1 and 350000.');
                    }

                    e.target.value = '';
                }
            });

            rankInput.addEventListener('blur', function(e) {
                const value = e.target.value;
                if (value) {
                    const numValue = parseInt(value) || 0;
                    if (numValue > 350000) {
                        console.log('Rank value exceeds 350000 on blur:', numValue);

                        if (typeof showValidationModal === 'function') {
                            console.log('Showing validation modal on blur');
                            showValidationModal(
                                'Invalid Rank',
                                'Please enter a rank between 1 and 350000.',
                                'error'
                            );
                        } else {
                            console.log('Showing alert on blur');
                            alert('Please enter a rank between 1 and 350000.');
                        }

                        e.target.value = '';
                    } else if (numValue < 1 && numValue !== 0) {
                        e.target.value = '';
                    }
                }
            });

            rankInput.addEventListener('paste', function(e) {
                setTimeout(() => {
                    const value = e.target.value;
                    if (value && !/^[0-9]*$/.test(value)) {
                        e.target.value = value.replace(/[^0-9]/g, '');
                        return;
                    }
                    
                    const numValue = parseInt(value) || 0;
                    if (numValue > 350000) {
                        console.log('Rank value exceeds 350000 on paste:', numValue);
                        if (typeof showValidationModal === 'function') {
                            console.log('Showing validation modal on paste');
                            showValidationModal(
                                'Invalid Rank',
                                'Please enter a rank between 1 and 350000.',
                                'error'
                            );
                        } else {
                            console.log('Showing alert on paste');
                            alert('Please enter a rank between 1 and 350000.');
                        }
                        e.target.value = '';
                    }
                }, 10);
            });
        }

        checkUrlParameters();
        
        if (rawData.length === 0) {
            renderEmptyState();
        }
        translateUI();
        updateDistrictOptions();
        updatePlacementOptions();

        console.log('Initializing comparison tray in initializePage');
        initializeMainComparisonTray();

        setTimeout(() => {
            sessionStorage.setItem('mainPageState', 'initialized');
        }, 1000);
    }

    /**
     * Clears cached data on page refresh.
     */
    function clearCacheOnRefresh() {
        localStorage.removeItem('collegeResults');
        localStorage.removeItem('sortedResults');
        localStorage.removeItem('collegeFormState');
    }
    
    /**
     * Checks URL parameters for direct college access.
     */
    function checkUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const instcode = urlParams.get('instcode');
        const view = urlParams.get('view');
        
        if (instcode && view === 'details') {
            setTimeout(() => {
                console.log('Calling showSpinner with true for instcode search');
                showSpinner(true);
                fetch(`https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges?_=${new Date().getTime()}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ instcode: instcode })
                })
                .then(res => res.json())
                .then(data => {
                    const filteredData = data.filter(college => college.instcode === instcode);
                    rawData = filteredData;
                    filterAndRenderColleges();
                    showSpinner(false);

                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch(err => {
                    console.error("Failed to load college details:", err);
                    showSpinner(false);
                });
            }, 100);
        }
    }
    
    /**
     * Loads all colleges data into cache for faster access in other views.
     */
    function loadAllCollegesCache() {
        fetch(`https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges?_=${new Date().getTime()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        })
        .then(res => res.json())
        .then(data => {
            allCollegesCache = data;
            console.log(`Loaded ${allCollegesCache.length} colleges`);
        })
        .catch(err => console.error("Failed to load colleges:", err));
    }

    /**
     * Sets the application theme (light or dark mode).
     * 
     * @param {string} theme - The theme to set ('light' or 'dark')
     */
    function setTheme(theme) {
        body.classList.toggle("dark-mode", theme === "dark");
        darkModeSwitch.checked = theme === "dark";
        localStorage.setItem("theme", theme);
    }

    /**
     * Shows or hides the loading spinner.
     * 
     * @param {boolean} show - Whether to show or hide the spinner
     */
    function showSpinner(show) {
        console.log('Setting spinner display to:', show ? "flex" : "none");
        loadingSpinner.style.display = show ? "flex" : "none";
    }

    /**
     * Shows a warning modal with the specified title and text.
     * 
     * @param {string} title - The title for the modal
     * @param {string} text - The text content for the modal
     */
    function showWarningModal(title, text) {
        if (!warningModal) return;
        warningModalTitle.textContent = title;
        warningModalText.textContent = text;
        warningModal.style.display = 'flex';
    }

    /**
     * Creates a Google Maps URL for a college location.
     * 
     * @param {string} collegeName - The name of the college
     * @param {string} districtCode - The district code
     * @returns {string} The Google Maps URL
     */
    function createLocationUrl(collegeName, districtCode) {
        const fullDistrict = districtCode || '';
        const query = encodeURIComponent(`${collegeName}, ${fullDistrict}`);
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }

    /**
     * Sorts data based on the specified criteria.
     * 
     * @param {Array} data - The data to sort
     * @param {string} criteria - The sorting criteria (e.g., 'cutoff-asc', 'probability-desc')
     * @returns {Array} The sorted data
     */
    function multiSort(data, criteria) {
        console.log('multiSort called with data length:', data.length, 'and criteria:', criteria);
        const [key, direction] = criteria.split("-");
        const sortConfig = SortMap[key];
        if (!sortConfig) {
            console.log('No sortConfig found for key:', key);
            return data;
        }
        const directionNum = direction === "desc" ? -1 : 1;
        const prop = sortConfig.prop;
        console.log('Sorting by prop:', prop, 'directionNum:', directionNum);
        try {
            const result = [...data].sort((a, b) => {
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
            console.log('multiSort completed, result length:', result.length);
            return result;
        } catch (error) {
            console.error('Error in multiSort:', error);
            return data;
        }
    }

    /**
     * Translates UI elements based on the translations object.
     */
    function translateUI() {
        document.querySelectorAll("[data-lang-key]").forEach(el => {
            const key = el.getAttribute("data-lang-key");
            const text = translations[key];
            if (text) {
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

    /**
     * Updates the display of selected items in a multiselect dropdown.
     * 
     * @param {Element} dropdown - The multiselect dropdown element
     * @param {Array} selectedValues - Array of selected values
     */
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

    /**
     * Toggles the visibility of a multiselect dropdown.
     * 
     * @param {Element} dropdown - The dropdown to toggle
     */
    function toggleDropdown(dropdown) {
        document.querySelectorAll('.multiselect-dropdown.open').forEach(openDropdown => {
            if (openDropdown !== dropdown) openDropdown.classList.remove('open');
        });
        dropdown.classList.toggle('open');
    }

    /**
     * Initializes a multiselect dropdown with options and event listeners.
     * 
     * @param {Element} dropdown - The dropdown element to initialize
     */
    function initializeMultiselect(dropdown) {
        const id = dropdown.getAttribute('data-id');
        const hiddenInput = document.getElementById(id);
        console.log(`Initializing multiselect ${id}, hidden input:`, hiddenInput);
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

                console.log(`Multiselect ${id} hidden input updated:`, hiddenInput.value);
                console.log(`Multiselect ${id} selected values:`, selectedValues);
                console.log(`Multiselect ${id} hidden input element:`, hiddenInput);
                
                updateSelectedItemsDisplay(dropdown, selectedValues);

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
    
    /**
     * Updates dependent options based on selected values.
     * 
     * @param {string} controlId - The ID of the control element
     * @param {string} hiddenInputId - The ID of the hidden input
     * @param {Set} allowedValues - Set of allowed values
     */
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

    /**
     * Updates district options based on selected regions.
     */
    function updateDistrictOptions() {
        const selectedRegions = (document.getElementById('region').value || "").split(',').filter(Boolean);
        let allowedDistricts = new Set(optionData.districts.map(d => d.value));
        if (selectedRegions.length > 0) {
            allowedDistricts = new Set();
            selectedRegions.forEach(region => regionDistrictMap[region]?.forEach(district => allowedDistricts.add(district)));
        }
        updateDependentOptions('district', 'district', allowedDistricts);
    }

    /**
     * Updates placement quality options.
     */
    function updatePlacementOptions() {
        let allowedValues = new Set(['Excellent', 'Very Good', 'Good', 'Bad']);
        updateDependentOptions('placementQualityFilter', 'placementQualityFilter', allowedValues);
    }

    /**
     * Resets the results display and clears data.
     */
    function resetResults() {
        rawData = [];
        sortedData = [];
        collegeListDiv.innerHTML = '';
        resultsHeader.style.display = 'none';
        selectedColleges = [];
        updateComparisonTray();
        sortBySelect.value = 'cutoff-asc';
    }

    /**
     * Filters and renders colleges based on current sort settings.
     */
    function filterAndRenderColleges() {
        console.log('filterAndRenderColleges called with rawData length:', rawData.length);
        const currentSelectedIds = selectedColleges.map(c => c.uniqueId);
        console.log('filterAndRenderColleges called, preserving selected colleges:', currentSelectedIds);
        
        sortedData = multiSort(rawData, sortBySelect.value);

        const newSelectedColleges = [];
        sortedData.forEach(college => {
            const uniqueId = `${college.instcode}-${college.branch}-${college.category}-${college.cutoff}`;
            if (currentSelectedIds.includes(uniqueId)) {
                college.uniqueId = uniqueId;
                newSelectedColleges.push(college);
            }
        });
        selectedColleges = newSelectedColleges;
        console.log('Restored selected colleges:', selectedColleges.map(c => c.uniqueId));
        
        renderColleges();
        updateComparisonTray();
    }

    /**
     * Renders college cards based on sorted data.
     */
    function renderColleges() {
        console.log('renderColleges called with sortedData length:', sortedData.length);
        if (!sortedData || sortedData.length === 0) {
            console.log('No data to render, calling renderEmptyState');
            renderEmptyState(translations.noDataText);
            return;
        }
        console.log('Showing results header');
        resultsHeader.style.display = 'flex';
        console.log('Clearing college list div');
        collegeListDiv.innerHTML = '';
        
        console.log('Creating college cards for', sortedData.length, 'colleges');
        sortedData.forEach((college, index) => {
            console.log('Creating card for college', index, ':', college);
            const card = document.createElement("div");

            const uniqueId = `${college.instcode}-${college.branch}-${college.category}-${college.cutoff}`; 
            card.className = "college-card";
            card.dataset.id = uniqueId; 
            
            const isSelected = selectedColleges.some(c => c.uniqueId === uniqueId);

            const collegeName = college.institution_name || college.name || "Unnamed College";
            const locationUrl = createLocationUrl(collegeName, college.district);
            const probClass = college.probability >= 75 ? 'prob-high' : college.probability >= 30 ? 'prob-medium' : 'prob-low';
            const qualityClass = `quality-${(college.placementDriveQuality || 'n/a').replace(/\s+/g, '-')}`;

            const collegeDataString = JSON.stringify(college).replace(/"/g, '"'); 

            const comparisonCheckbox = `
                <div class="compare-checkbox-wrapper">
                    <label for="compare-${uniqueId}" title="${translations.compareCheck}">
                        <input type="checkbox" id="compare-${uniqueId}" class="compare-checkbox" data-college='${collegeDataString}' data-unique-id="${uniqueId}" ${isSelected ? 'checked' : ''} onchange="handleCompareCheckbox(event)" />
                        <span>${translations.compareCheck}</span>
                    </label>
                </div>
            `;
            
            console.log('Rendering college checkbox:', uniqueId, 'isSelected:', isSelected);
            
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
            console.log('Appending card to collegeListDiv');
            collegeListDiv.appendChild(card);
        });
        console.log('Finished creating college cards, collegeListDiv now has', collegeListDiv.children.length, 'children');
        
        console.log('Finished rendering colleges, calling initializeMainComparisonTray');
        initializeMainComparisonTray();
        console.log('initializeMainComparisonTray completed');
    }

    /**
     * Renders an empty state message when no data is available.
     * 
     * @param {string} message - The message to display
     */
    function renderEmptyState(message) {
        resultsHeader.style.display = 'none';
        collegeListDiv.innerHTML = `<div class="empty-state"><i class="fas fa-search-location"></i><h2>Your Results Will Appear Here</h2><p>${message || "Enter your rank to see college predictions."}</p></div>`;

        if (message && message !== "Enter your rank to see college predictions." && 
            typeof showValidationModal === 'function' && 
            typeof ValidationMessages !== 'undefined' && 
            ValidationMessages.noResults) {
            showValidationModal(
                ValidationMessages.noResults.title,
                ValidationMessages.noResults.message,
                ValidationMessages.noResults.type
            );
        }

        initializeMainComparisonTray();
    }

    /**
     * Handles the compare checkbox change event.
     * 
     * @param {Event} event - The checkbox change event
     */
    window.handleCompareCheckbox = (event) => {
        const checkbox = event.target;
        const uniqueId = checkbox.dataset.uniqueId;
        
        console.log('handleCompareCheckbox called for', uniqueId, 'checked:', checkbox.checked);
        console.log('Selected colleges before:', selectedColleges.length);
        
        let collegeData;
        try {
            const dataString = checkbox.getAttribute('data-college').replace(/"/g, '"');
            collegeData = JSON.parse(dataString);
            console.log('Parsed college data:', collegeData);
        } catch (e) {
            console.error("Error parsing college data, preventing selection:", e);
            checkbox.checked = false; 
            return;
        }

        collegeData.uniqueId = uniqueId;

        if (checkbox.checked) {
            if (selectedColleges.length < 6) { 
                if (!selectedColleges.some(c => c.uniqueId === uniqueId)) {
                    selectedColleges.push(collegeData);
                    console.log('Added college to selection, total:', selectedColleges.length);
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
            console.log('Removed college from selection, total:', selectedColleges.length);
        }
        updateComparisonTray();
    };

    /**
     * Removes a college from the comparison selection.
     * 
     * @param {string} uniqueId - The unique ID of the college to remove
     */
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

    /**
     * Updates the comparison tray display based on selected colleges.
     */
    function updateComparisonTray() {
        const count = selectedColleges.length;
        const countText = translations.compareCount;
        
        console.log('Updating comparison tray, count:', count);
        console.log('comparisonTray element in updateComparisonTray:', comparisonTray);
        
        if (comparisonTray) {
            console.log('Comparison tray element found:', comparisonTray);
            console.log('Current classes:', comparisonTray.className);
        } else {
            console.log('Comparison tray element NOT found!');
        }
        
        if (comparisonTray && comparisonTray.querySelector('p')) {
            comparisonTray.querySelector('p').innerHTML = `<span id="compare-count" style="color: var(--color-accent); margin-right: 0.25rem;">${count}</span> ${countText}`;
        }

        if (count > 0) {
            if (comparisonTray) {
                comparisonTray.classList.add('visible');
                comparisonTray.classList.remove('hidden');
                console.log('Showing comparison tray, new classes:', comparisonTray.className);
            }
        } else {
            if (comparisonTray) {
                comparisonTray.classList.remove('visible');
                comparisonTray.classList.add('hidden');
                console.log('Hiding comparison tray, new classes:', comparisonTray.className);
            }
        }
        
        if (compareNowBtn) {
            compareNowBtn.disabled = count < 2;
        }
        if (compareNowBtn) {
            compareNowBtn.textContent = translations.compareNow;
        }
        
        console.log('Comparison tray updated with count:', count);
    }
    
    /**
     * Opens the comparison modal to display selected colleges side-by-side.
     * 
     * @param {boolean} isFirstOpen - Whether this is the first time opening the modal
     */
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

        tableHTML += `<th class="sticky-feature">${translations.tableFeature}</th>`; 

        selectedColleges.forEach(college => {
            const safeCollegeName = (college.name || 'N/A').replace(/'/g, "'"); 

            tableHTML += `
                <th class="text-center">
                    <span class="college-name-row">${safeCollegeName}</span>
                    <button class="remove-col-btn mt-2" onclick="removeCollegeFromComparison('${college.uniqueId}')" title="Remove College">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </th>
            `;
        });

        tableHTML += `</tr></thead><tbody>`;

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
                    const quotaCode = value.split('_')[0].toUpperCase();
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

    /**
     * Sets up event listeners for various UI elements.
     */
    function setupEventListeners() {
        console.log('setupEventListeners called');

        console.log('comparisonTray:', comparisonTray);
        console.log('compareNowBtn:', compareNowBtn);
        console.log('clearCompareBtn:', clearCompareBtn);

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

        if (predictButton) {
            console.log('Attaching event listener to predictButton');
            predictButton.addEventListener("click", function(e) {
                console.log('Predict button clicked directly');
                handlePrediction();
            });
        } else {
            console.error('predictButton not found');
        }
        
        if (predictButtonBottom) {
            console.log('Attaching event listener to predictButtonBottom');
            predictButtonBottom.addEventListener("click", function(e) {
                console.log('Predict button bottom clicked directly');
                handlePrediction();
            });
        } else {
            console.log('predictButtonBottom not found');
        }

        sortBySelect.addEventListener("change", filterAndRenderColleges);

        if (compareNowBtn) {
            compareNowBtn.addEventListener('click', () => openComparisonModal(true));
        }

        document.addEventListener('click', function(e) {
            if (e.target.id === 'compare-now-btn' || (e.target.closest && e.target.closest('#compare-now-btn'))) {
                openComparisonModal(true);
            }
        });
        
        if (clearCompareBtn) {
            clearCompareBtn.addEventListener('click', () => {
                selectedColleges.forEach(c => {
                    const checkbox = document.getElementById(`compare-${c.uniqueId}`);
                    if (checkbox) checkbox.checked = false;
                });
                selectedColleges = [];
                updateComparisonTray();
            });
        }
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => comparisonModal.style.display = 'none');
        }
        if (comparisonModal) {
            comparisonModal.addEventListener('click', (e) => {
                if (e.target === comparisonModal) {
                    comparisonModal.style.display = 'none';
                }
            });
        }

        if (warningModal) {
            warningModalCloseBtn.addEventListener('click', () => warningModal.style.display = 'none');
            warningModal.addEventListener('click', (e) => {
                if (e.target === warningModal) {
                    warningModal.style.display = 'none';
                }
            });
        }
        
        clearButton.addEventListener("click", () => {
            console.log('Clear button clicked - clearing all form values');
            predictForm.reset();
            rankInput.value = '';

            document.querySelectorAll('#predictForm input[type="hidden"]').forEach(input => {
                console.log('Clearing hidden input:', input.id, 'value before:', input.value);
                input.value = '';
                console.log('Hidden input cleared:', input.id, 'value after:', input.value);
            });
            multiselectContainers.forEach(dropdown => {
                dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
                updateSelectedItemsDisplay(dropdown, []);
            });
            updateDistrictOptions();
            updatePlacementOptions();
            renderEmptyState();
            rawData = [];
            sortedData = [];

            selectedColleges = [];
            updateComparisonTray();
        });

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

    /**
     * Handles the prediction process by collecting form data and calling the API.
     */
    function handlePrediction() {
        console.log('Predict button clicked - triggering form submission');
        console.log('Form element:', predictForm);
        console.log('Rank input value:', rankInput.value);

        const rank = parseInt(rankInput.value) || 0;
        const rankValue = rankInput.value.trim();
        
        console.log('Rank value:', rankValue);
        console.log('Parsed rank:', rank);

        if (rankValue !== '') {
            if (rank <= 0) {
                console.log('Invalid rank detected, showing validation modal');
                if (typeof showValidationModal === 'function' && ValidationMessages && ValidationMessages.invalidRank) {
                    showValidationModal(
                        ValidationMessages.invalidRank.title,
                        ValidationMessages.invalidRank.message,
                        ValidationMessages.invalidRank.type
                    );
                } else {
                    console.error('showValidationModal function or ValidationMessages.invalidRank not available');
                }
                return;
            }

            if (rank > 350000) {
                console.log('Rank out of range, showing validation modal');
                if (typeof showValidationModal === 'function') {
                    showValidationModal(
                        'Invalid Rank',
                        'Please enter a rank between 1 and 350000.',
                        'error'
                    );
                } else {
                    alert('Please enter a rank between 1 and 350000.');
                }
                return;
            }
        }

        const filters = {};
        const filterInputs = [
            { id: 'desiredBranch', paramName: 'branch' },
            { id: 'quota', paramName: 'quota' },
            { id: 'gender', paramName: 'gender' },
            { id: 'region', paramName: 'region' },
            { id: 'district', paramName: 'district' },
            { id: 'tier', paramName: 'tier' },
            { id: 'placementQualityFilter', paramName: 'placementQualityFilter' }
        ];
        
        filterInputs.forEach(filter => {
            const inputElement = document.getElementById(filter.id);
            if (inputElement && inputElement.value) {
                filters[filter.paramName] = inputElement.value;
                console.log(`Added ${filter.paramName} to filters:`, inputElement.value);
            }
        });

        const hasRank = rankValue !== '';
        const hasFilters = Object.keys(filters).some(key => filters[key]);
        
        console.log('Has rank:', hasRank);
        console.log('Has filters:', hasFilters);

        if (!hasRank && !hasFilters) {
            console.log('No input provided, showing validation modal');
            if (typeof showValidationModal === 'function' && ValidationMessages && ValidationMessages.noInput) {
                showValidationModal(
                    ValidationMessages.noInput.title,
                    ValidationMessages.noInput.message,
                    ValidationMessages.noInput.type
                );
            } else {
                console.error('showValidationModal function or ValidationMessages.noInput not available');
            }
            return;
        }

        let requestData = { rank: hasRank ? rank : null };

        Object.keys(filters).forEach(key => {
            if (key === 'quota') {
                const quotaValues = filters[key].split(',').filter(Boolean);
                if (quotaValues.length > 0) {
                    requestData['category'] = quotaValues[0];
                    console.log('Setting category parameter to:', quotaValues[0]);
                }
            } else if (key === 'gender') {
                const genderValues = filters[key].split(',').filter(Boolean);
                if (genderValues.length > 0) {
                    requestData['gender'] = genderValues[0];
                    console.log('Setting gender parameter to:', genderValues[0]);
                }
            } else {
                if (filters[key]) {
                    requestData[key] = filters[key];
                    console.log('Setting', key, 'parameter to:', filters[key]);
                }
            }
        });
        
        console.log('Final request data being sent:', requestData);

        console.log('Resetting results and showing spinner');
        resetResults();
        console.log('Calling showSpinner with true');
        showSpinner(true);

        console.log('Making API call with requestData:', requestData);
        const url = `https://theeamcetcollegeprediction-2.onrender.com/api/predict-colleges?_=${new Date().getTime()}`;
        console.log('API URL:', url);
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        })
        .then(response => { 
            console.log('API response status:', response.status);
            console.log('API response headers:', response.headers);
            console.log('API response ok:', response.ok);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            } 
            return response.json(); 
        })
        .then(data => { 
            console.log('API response data received:', data);
            console.log('API response data type:', typeof data);
            console.log('API response data is array:', Array.isArray(data));
            if (!data || !Array.isArray(data)) {
                throw new Error('Invalid data format received from API');
            }
            console.log('Setting rawData and calling filterAndRenderColleges');
            rawData = data; 
            filterAndRenderColleges(); 
        })
        .catch(error => { 
            console.error("Fetch Error:", error); 
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            if (typeof renderEmptyState === 'function' && translations && translations.fetchError) {
                renderEmptyState(translations.fetchError + " " + error.message); 
            } else {
                console.error('renderEmptyState function or translations.fetchError not available');
            }
        })
        .finally(() => {
            console.log('Fetch completed');
            console.log('Hiding spinner');
            showSpinner(false);
        });
    }

    setTimeout(function() {
        const compareNowBtn = document.getElementById('compare-now-btn');
        if (compareNowBtn) {
            compareNowBtn.addEventListener('click', function() {
                openComparisonModal(true);
            });
        }

        initializeMainComparisonTray();
    }, 1000);

    /**
     * Initializes the main comparison tray on page load.
     */
    function initializeMainComparisonTray() {
        const count = selectedColleges.length;
        
        console.log('initializeMainComparisonTray called, count:', count);
        console.log('comparisonTray element:', comparisonTray);
        
        if (comparisonTray) {
            console.log('Comparison tray found in initializeMainComparisonTray');

            console.log('Updating comparison tray visibility, count:', count);
            if (count > 0) {
                console.log('Adding visible class and removing hidden class');
                comparisonTray.classList.add('visible');
                comparisonTray.classList.remove('hidden');
                console.log('Set tray to visible');
            } else {
                console.log('Removing visible class and adding hidden class');
                comparisonTray.classList.remove('visible');
                comparisonTray.classList.add('hidden');
                console.log('Set tray to hidden');
            }

            if (compareNowBtn) {
                console.log('Setting compare button disabled state, count < 2:', count < 2);
                compareNowBtn.disabled = count < 2;
                console.log('Set compare button disabled:', count < 2);
            }
        } else {
            console.log('Comparison tray NOT found in initializeMainComparisonTray');
        }
    }
});