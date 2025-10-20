document.addEventListener("DOMContentLoaded", function () {
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
        districts: [
            { value: "ATP", text: "Anantapur" }, { value: "CTR", text: "Chittoor" }, { value: "EG", text: "East Godavari" }, { value: "GTR", text: "Guntur" }, { value: "KDP", text: "Kadapa (YSR Kadapa)" }, { value: "KNL", text: "Kurnool" }, { value: "KRI", text: "Krishna" }, { value: "NLR", text: "Nellore (SPSR Nellore)" }, { value: "PKS", text: "Prakasam" }, { value: "SKL", text: "Srikakulam" }, { value: "VSP", text: "Visakhapatnam" }, { value: "VZM", text: "Vizianagaram" }, { value: "WG", text: "West Godavari" },
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
        "AU": ["VSP", "VZM", "SKL", "EG", "WG"],
        "SVU": ["CTR", "KDP", "NLR"],
        "SW": ["ATP", "KNL", "GTR", "KRI", "PKS"]
    };

    const translations = {
        en: {
            btnPredict: "Predict Now", btnClear: "Clear All Filters", disclaimerStrong: "Disclaimer:",
            disclaimerText: "Prediction is based on previous years' cutoff data and trends. Actual cutoffs may vary due to factors such as applicants and seat availability.",
            sortLabel: "Sort By:", selectAll: "Select All", sortProbabilityDesc: "Probability (High to Low)", sortProbabilityAsc: "Probability (Low to High)",
            sortCutoffAsc: "Cutoff Rank (Low to High)", sortCutoffDesc: "Cutoff Rank (High to Low)",
            sortAvgPackageDesc: "Average Package (High to Low)", sortAvgPackageAsc: "Average Package (Low to High)",
            sortHighestPackageDesc: "Highest Package (High to Low)", sortHighestPackageAsc: "Highest Package (Low to High)",
            sortQualityDesc: "Placement Quality (Best to Worst)", sortQualityAsc: "Placement Quality (Worst to Best)",
            btnSavePdf: "Save as PDF", btnSaveCsv: "Save as CSV",
            noDataText: "No colleges found matching your criteria.", noInputText: "Please enter a valid positive rank to get predictions.",
            fetchError: "Could not fetch predictions. Please try again later.", itemsSelected: "items selected",
            downloadNoData: "Please predict colleges first to download results.",
            labelBranch: "Branch Preference", selectBranch: "Select Branch",
            labelQuota: "Reservation Quota", selectQuota: "Select Quota",
            labelGender: "Gender", selectGender: "Select Gender",
            labelRegion: "Region", selectRegion: "Select Region",
            labelDistrict: "District", selectDistrict: "Select District",
            labelTier: "College Tier", selectTier: "Select Tier",
            labelPlacementQuality: "Placement Quality", selectQuality: "Select Quality",
        },
        te: {
            btnPredict: "కళాశాలలను అంచనా వేయి", btnClear: "ఫిల్టర్లు క్లియర్ చేయండి", disclaimerStrong: "అనుమతి:",
            disclaimerText: "గత సంవత్సరాల కటాఫ్ డేటా మరియు ట్రెండ్స్ ఆధారంగా అంచనా. వాస్తవ కటాఫ్లు దరఖాస్తుదారులు మరియు సీట్ల లభ్యతపై ఆధారపడి మారవచ్చు.",
            sortLabel: "ఫలితాలను సర్దుబాటు చేయండి:", selectAll: "అన్నింటిని ఎంచుకోండి",
            sortProbabilityDesc: "అవకాశం (ఎక్కువ నుండి తక్కువ)", sortProbabilityAsc: "అవకాశం (తక్కువ నుండి ఎక్కువ)",
            sortCutoffAsc: "కటాఫ్ ర్యాంక్ (తక్కువ నుండి ఎక్కువ)", sortCutoffDesc: "కటాఫ్ ర్యాంక్ (ఎక్కువ నుండి తక్కువ)",
            sortAvgPackageDesc: "సగటు ప్యాకేజ్ (ఎక్కువ నుండి తక్కువ)", sortAvgPackageAsc: "సగటు ప్యాకేజ్ (తక్కువ నుండి ఎక్కువ)",
            sortHighestPackageDesc: "అత్యధిక ప్యాకేజ్ (ఎక్కువ నుండి తక్కువ)", sortHighestPackageAsc: "అత్యధిక ప్యాకేజ్ (తక్కువ నుండి ఎక్కువ)",
            sortQualityDesc: "ప్లేస్‌మెంట్ నాణ్యత (ఉత్తమ నుంచి చెత్త)", sortQualityAsc: "ప్లేస్‌మెంట్ నాణ్యత (చెత్త నుంచి ఉత్తమ)",
            btnSavePdf: "PDFగా సేవ్ చెయ్యండి", btnSaveCsv: "CSVగా సేవ్ చెయ్యండి",
            noInputText: "దయచేసి సరైన పాజిటివ్ ర్యాంక్ను నమోదు చేయండి.",
            fetchError: "ఏదో పొరపాటు వచ్చింది. కన్సోల్‌ను తనిఖీ చేయండి.",
            downloadNoData: "దయచేసి ఫలితాలను డౌన్లోడ్ చేయడానికి ముందుగా కళాశాలలను అంచనా వేయండి.",
            itemsSelected: "ఎంచుకోబడిన అంశాలు",
            labelBranch: "ఆసక్తిగల శాఖ", selectBranch: "శాఖను ఎంచుకోండి",
            labelQuota: "కోటా", selectQuota: "కోటాను ఎంచుకోండి",
            labelGender: "లింగం", selectGender: "లింగాన్ని ఎంచుకోండి",
            labelRegion: "ప్రాంతం", selectRegion: "ప్రాంతం ఎంచుకోండి",
            labelDistrict: "జిల్లా", selectDistrict: "జిల్లా ఎంచుకోండి",
            labelTier: "టియర్", selectTier: "టియర్ ఎంచుకోండి",
            labelPlacementQuality: "ప్లేస్‌మెంట్ నాణ్యత", selectQuality: "నాణ్యతను ఎంచుకోండి",
        }
    };
    
    const SortMap = {
        'probability': { prop: 'probability' }, 'cutoff': { prop: 'cutoff' },
        'avgPackage': { prop: 'averagePackage' }, 'highestPackage': { prop: 'highestPackage' },
        'quality': { prop: 'placementDriveQuality', order: { "Excellent": 4, "Very Good": 3, "Good": 2, "Bad": 1 } }
    };

    // === 2. ELEMENT SELECTORS ===
    const body = document.body;
    const darkModeSwitch = document.getElementById("darkModeSwitch");
    const langSelect = document.getElementById("langSelect");
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
    const finalCategoryInput = document.getElementById("category");
    const downloadBtn = document.getElementById("downloadBtn");
    const downloadMenu = document.getElementById("downloadMenu");
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");
    const downloadCsvBtn = document.getElementById("downloadCsvBtn");
    const scrollButtons = document.getElementById("scrollButtons");
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    const scrollBottomBtn = document.getElementById("scrollBottomBtn");

    // === 3. STATE VARIABLES ===
    let rawData = [];
    let sortedData = [];
    let currentLang = "en";

    // === 4. INITIALIZATION ===
    initializePage();

    function initializePage() {
        setTheme(localStorage.getItem("theme") || 'light');
        multiselectContainers.forEach(initializeMultiselect);
        setupEventListeners();
        renderEmptyState();
        translateUI();
        updateDistrictOptions(); // FIXED: Added this line to initialize district filter
        updatePlacementOptions(); // FIXED: Added this line to initialize placement filter
    }

    // === 5. CORE LOGIC & HELPER FUNCTIONS ===
    function setTheme(theme) {
        body.classList.toggle("dark-mode", theme === "dark");
        darkModeSwitch.checked = theme === "dark";
        localStorage.setItem("theme", theme);
    }

    function showSpinner(show) {
        loadingSpinner.style.display = show ? "flex" : "none";
    }

    function createLocationUrl(collegeName, districtCode) {
        const fullDistrict = optionData.districts.find(d => d.value === districtCode)?.text || districtCode || '';
        const query = encodeURIComponent(`${collegeName}, ${fullDistrict}`);
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    }

    function updateFinalCategory() {
        const quota = document.getElementById("quota").value;
        const gender = document.getElementById("gender").value;
        finalCategoryInput.value = quota ? `${quota}_${gender || 'boys'}` : '';
    }

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
            const text = translations[currentLang][key];
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
        rankInput.placeholder = currentLang === 'te' ? "మీ ర్యాంక్ ఇవ్వండి" : "Enter your rank here (e.g., 15000)";
        multiselectContainers.forEach(dropdown => {
            const hiddenInput = document.getElementById(dropdown.getAttribute('data-id'));
            const selectedValues = (hiddenInput?.value || "").split(',').filter(Boolean);
            updateSelectedItemsDisplay(dropdown, selectedValues);
        });
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
        if (placeholderKey && translations[currentLang][placeholderKey]) {
            placeholderText = translations[currentLang][placeholderKey];
        }

        if (selectedValues.length === 0 || !selectedValues[0]) {
            selectedItemsSpan.textContent = placeholderText;
            return;
        }
        
        const dataSourceKey = dropdown.querySelector('.options-list').getAttribute('data-source');
        const dataSource = optionData[dataSourceKey];
        if (!dataSource) return;

        const selectedTexts = selectedValues.map(val => dataSource.find(opt => opt.value === val)?.text || val);
        selectedItemsSpan.textContent = selectedTexts.length === 1 ? selectedTexts[0] : `${selectedTexts.length} ${translations[currentLang].itemsSelected}`;
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

                if (id === 'quota' || id === 'gender') updateFinalCategory();
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
    const selectedTiers = (document.getElementById('tier').value || "").split(',').filter(Boolean);
    let allowedValues = new Set();

    // If no specific tier is selected, show all placement qualities.
    if (selectedTiers.length === 0) {
        allowedValues = new Set(['Excellent', 'Very Good', 'Good', 'Bad']);
    } else {
        // Add allowed qualities for each selected tier to the set.
        if (selectedTiers.includes('Tier 1')) {
            allowedValues.add('Excellent');
            allowedValues.add('Very Good');
        }
        if (selectedTiers.includes('Tier 2')) {
            allowedValues.add('Excellent');
            allowedValues.add('Very Good');
            allowedValues.add('Good');
        }
        if (selectedTiers.includes('Tier 3')) {
            allowedValues.add('Good');
            allowedValues.add('Bad');
        }
    }

    updateDependentOptions('placementQualityFilter', 'placementQualityFilter', allowedValues);
}

    // === 7. PREDICTION & RENDERING LOGIC ===
    function handlePrediction(event) {
        event.preventDefault();
        showSpinner(true);
        collegeListDiv.innerHTML = '';
        resultsHeader.style.display = 'none';
        const requestData = {
            rank: rankInput.value ? parseInt(rankInput.value, 10) : null,
            branch: document.getElementById("desiredBranch").value || null,
            category: finalCategoryInput.value || null,
            district: document.getElementById("district").value || null,
            region: document.getElementById("region").value || null,
            tier: document.getElementById("tier").value || null,
            placementQualityFilter: document.getElementById("placementQualityFilter").value || null
        };
        if (!requestData.rank || requestData.rank <= 0) {
            renderEmptyState(translations[currentLang].noInputText);
            showSpinner(false);
            return;
        }
        fetch("https://theeamcetcollegeprediction-2.onrender.com/api/api/predict-colleges", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestData)
        })
        .then(response => { if (!response.ok) throw new Error(`API Error: ${response.statusText}`); return response.json(); })
        .then(data => { rawData = data; filterAndRenderColleges(); })
        .catch(error => { console.error("Fetch Error:", error); renderEmptyState(translations[currentLang].fetchError); })
        .finally(() => showSpinner(false));
    }

    function filterAndRenderColleges() {
        sortedData = multiSort(rawData, sortBySelect.value);
        renderColleges();
    }

    function renderColleges() {
        if (!sortedData || sortedData.length === 0) {
            renderEmptyState(translations[currentLang].noDataText);
            return;
        }
        resultsHeader.style.display = 'flex';
        collegeListDiv.innerHTML = '';
        sortedData.forEach(college => {
            const card = document.createElement("div");
            card.className = "college-card";
            const collegeName = college.institution_name || college.name || "Unnamed College";
            const locationUrl = createLocationUrl(collegeName, college.district);
            const probClass = college.probability >= 75 ? 'prob-high' : college.probability >= 30 ? 'prob-medium' : 'prob-low';
            const qualityClass = `quality-${(college.placementDriveQuality || 'n/a').replace(/\s+/g, '-')}`;

            card.innerHTML = `
                <a href="${locationUrl}" target="_blank" class="card-location-link" title="View on Map">
                    <i class="fa-solid fa-location-dot"></i> <span>Location</span>
                </a>
                <h3 class="card-title">${collegeName}</h3>
                <p class="card-branch-info">${college.branch || 'N/A'} <span>(${college.category || 'N/A'})</span></p>
                <div class="card-details-grid">
                    <div class="card-details-item"><strong>Cutoff Rank (${college.category || 'N/A'})</strong><p>${college.cutoff ? college.cutoff.toLocaleString() : 'N/A'}</p></div>
                    <div class="card-details-item"><strong>Avg. Package</strong><p>${college.averagePackage ? `₹${college.averagePackage.toFixed(2)} Lakhs` : 'N/A'}</p></div>
                    <div class="card-details-item"><strong>Placement Drive Quality</strong><p class="${qualityClass}">${college.placementDriveQuality || 'N/A'}</p></div>
                    <div class="card-details-item"><strong>Predicted Chance</strong><p class="${probClass}">${college.probability ? college.probability.toFixed(0) + '%' : 'N/A'}</p></div>
                    <div class="card-details-item"><strong>Highest Package</strong><p>${college.highestPackage ? `₹${college.highestPackage.toFixed(2)} Lakhs` : 'N/A'}</p></div>
                </div>
                <div class="card-footer">
                    <span><strong>Inst. Code:</strong> ${college.instcode || 'N/A'}</span>
                    <span><strong>Location:</strong> ${optionData.districts.find(d => d.value === college.district)?.text || 'N/A'} (${college.region || 'N/A'})</span>
                    <span><strong>Tier:</strong> ${college.tier || 'N/A'}</span>
                </div>
            `;
            collegeListDiv.appendChild(card);
        });
    }

    function renderEmptyState(message) {
        resultsHeader.style.display = 'none';
        collegeListDiv.innerHTML = `<div class="empty-state"><i class="fas fa-search-location"></i><h2>Your Results Will Appear Here</h2><p>${message || "Enter your rank to see college predictions."}</p></div>`;
    }

    // === 8. EVENT LISTENERS SETUP ===
    function setupEventListeners() {
        darkModeSwitch.addEventListener("change", () => setTheme(darkModeSwitch.checked ? "dark" : "light"));
        predictButton.addEventListener("click", handlePrediction);
        sortBySelect.addEventListener("change", filterAndRenderColleges);
        langSelect.addEventListener("change", (e) => { currentLang = e.target.value; translateUI(); });
        clearButton.addEventListener("click", () => {
            predictForm.reset();
            rankInput.value = '';
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
        });

        /* // --- MODIFICATION START ---
        // The following event listeners that control the filter accordion have been removed.
        filtersHeader.addEventListener('click', () => {
            const isOpening = !filtersContainer.classList.contains('is-open');
            filtersHeader.classList.toggle('is-open');
            filtersContainer.classList.toggle('is-open');
            filtersHeader.setAttribute('aria-expanded', isOpening);
        });
        filtersHeader.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); filtersHeader.click(); } });
        // --- MODIFICATION END ---
        */
        
        downloadBtn.addEventListener('click', () => {
            if (sortedData.length === 0) {
                alert(translations[currentLang].downloadNoData);
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