document.addEventListener("DOMContentLoaded", function () {
    // === Data Definitions for Multi-selects (UPDATED) ===
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
        // NEW: Category Split - Quotas
        quotas: [
            { value: "oc", text: "OC (Open Category)" }, 
            { value: "sc", text: "SC (Scheduled Caste)" }, 
            { value: "st", text: "ST (Scheduled Tribe)" }, 
            { value: "bca", text: "BC-A" }, 
            { value: "bcb", text: "BC-B" }, 
            { value: "bcc", text: "BC-C" }, 
            { value: "bcd", text: "BC-D" }, 
            { value: "bce", text: "BC-E" },
            { value: "oc_ews", text: "OC (EWS Quota)" },
        ],
        // NEW: Category Split - Genders
        genders: [ 
            { value: "boys", text: "Boys" },
            { value: "girls", text: "Girls" },
        ],
        
        districts: [
            { value: "ATP", text: "Anantapur" }, { value: "CTR", text: "Chittoor" },
            { value: "EG", text: "East Godavari" }, { value: "GTR", text: "Guntur" },
            { value: "KDP", text: "Kadapa (YSR Kadapa)" }, { value: "KNL", text: "Kurnool" },
            { value: "KRI", text: "Krishna" }, { value: "NLR", text: "Nellore (SPSR Nellore)" },
            { value: "PKS", text: "Prakasam" }, { value: "SKL", text: "Srikakulam" },
            { value: "VSP", text: "Visakhapatnam" }, { value: "VZM", text: "Vizianagaram" },
            { value: "WG", text: "West Godavari" },
        ],
        regions: [
            { value: "AU", text: "Andhra University Region" },
            { value: "SVU", text: "Sri Venkateswara University Region" },
            { value: "SW", text: "South-West region" },
        ],
        tiers: [
            { value: "Tier 1", text: "Tier 1" },
            { value: "Tier 2", text: "Tier 2" },
            { value: "Tier 3", text: "Tier 3" },
        ],
        placementQuality: [
            { value: "Excellent", text: "Excellent" },
            { value: "Very Good", text: "Very Good" },
            { value: "Good", text: "Good" },
            { value: "Bad", text: "Bad" },
        ]
    };

    // === Variables ===
    const darkModeSwitch = document.getElementById("darkModeSwitch");
    const body = document.body;
    const predictForm = document.getElementById("predictForm");
    const rankInput = document.getElementById("rank");
    const multiselectContainers = document.querySelectorAll('.multiselect-dropdown');
    const collegeListDiv = document.getElementById("collegeList");
    const resultsControlsDiv = document.querySelector(".results-controls");
    const inputSummaryDiv = document.getElementById("inputSummary");
    const sortBySelect = document.getElementById("sortBy");
    const downloadIcon = document.getElementById("downloadIcon");
    const savePdfButton = document.getElementById("savePdfButton");
    const saveCsvButton = document.getElementById("saveCsvButton");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const langSelect = document.getElementById("langSelect");
    
    // NEW: Quota/Gender/Missing Data Variables
    const quotaInput = document.getElementById("quota");
    const genderInput = document.getElementById("gender");
    const finalCategoryInput = document.getElementById("category");
    const showMissingDataCheckbox = document.getElementById("showMissingData");

    let rawData = [];
    let filteredData = [];
    let sortedData = null;
    let filterTimeout = null;

    // Helper map for full district names (UNCHANGED)
    const districtMap = {
        "ATP": "Anantapur", "CTR": "Chittoor", "EG": "East Godavari", "GTR": "Guntur",
        "KDP": "Kadapa (YSR Kadapa)", "KNL": "Kurnool", "KRI": "Krishna", "NLR": "Nellore (SPSR Nellore)",
        "PKS": "Prakasam", "SKL": "Srikakulam", "VSP": "Visakhapatnam", "VZM": "Vizianagaram",
        "WG": "West Godavari",
    };

    // Helper function to get readable category text (UPDATED for split)
    function getCategoryText(value) {
        if (!value) return null;
        
        const parts = value.split('_'); 
        if (parts.length >= 2) {
            // Special handling for oc_ews_boys/girls
            const quotaValue = parts.length > 2 ? `${parts[0]}_${parts[1]}` : parts[0];
            const genderValue = parts[parts.length - 1];

            const quotaOption = optionData.quotas.find(opt => opt.value === quotaValue);
            const genderOption = optionData.genders.find(opt => opt.value === genderValue);

            if (quotaOption && genderOption) {
                 return `${quotaOption.text.split('(')[0].trim()} ${genderOption.text}`;
            }
        }
        return value;
    }

    // Helper map for sorting configuration (UNCHANGED)
    const SortMap = {
        'probability': { prop: 'probability', qualityValue: false },
        'cutoff': { prop: 'cutoff', qualityValue: false },
        'avgPackage': { prop: 'averagePackage', qualityValue: false },
        'highestPackage': { prop: 'highestPackage', qualityValue: false },
        'quality': { prop: 'placementDriveQuality', qualityValue: true }
    };

    // Quality mapping for numerical sort (UNCHANGED)
    const qualityOrder = { "Excellent": 4, "Very Good": 3, "Good": 2, "Bad": 1, "N/A": 0 };

    // === Translation strings (UPDATED with new keys and legend) ===
    const translations = {
        en: {
            labelRank: "EAMCET Rank:", labelBranch: "Desired Branch (Optional):", selectBranch: "Select Branch",
            // NEW KEYS: Category Split
            labelQuota: "Quota (Optional):", selectQuota: "Select Quota", 
            labelGender: "Gender (Optional):", selectGender: "Select Gender",
            
            labelDistrict: "District (Optional):", selectDistrict: "Select District", labelRegion: "Region (Optional):", selectRegion: "Select Region",
            labelTier: "Tier (Optional):", selectTier: "Select Tier", labelPlacementQuality: "Placement Drives Quality (Optional):", selectQuality: "Select Quality",
            
            // NEW KEY: Missing Data Switch
            showMissingDataLabel: "Show Colleges with Missing Data (Cutoff/Package/Quality)", 
            
            btnPredict: "Predict Colleges", btnClear: "Clear Filters", disclaimerStrong: "Disclaimer:",
            disclaimerText: "Prediction is based on previous years' cutoff data and trends. Actual cutoffs may vary due to factors such as applicants and seat availability.",
            summaryTitle: "Your Criteria", sortLabel: "Sort Results By:", selectAll: "Select All",
            sortProbabilityDesc: "Probability (High to Low)", sortProbabilityAsc: "Probability (Low to High)",
            sortCutoffAsc: "Cutoff Rank (Low to High)", sortCutoffDesc: "Cutoff Rank (High to Low)",
            sortAvgPackageDesc: "Average Package (High to Low)", sortAvgPackageAsc: "Average Package (Low to High)",
            sortHighestPackageDesc: "Highest Package (High to Low)", sortHighestPackageAsc: "Highest Package (Low to High)",
            sortQualityDesc: "Placement Quality (Best to Worst)", sortQualityAsc: "Placement Quality (Worst to Best)",
            btnSavePdf: "Save as PDF", btnSaveCsv: "Save as CSV", loadingText: "Loading colleges...",
            noDataText: "No colleges found matching your criteria.", 
            noInputText: "Please enter a valid positive rank or select at least one filter.", 
            fetchError: "Something went wrong. Check console for details.", retryFetch: "Retry",
            downloadNoData: "Please predict colleges first to download the results.",
            itemsSelected: "items selected",
            
            // NEW KEYS: Probability Legend
            probLegendTitle: "Predicted Chance Legend:", 
            probLegendHigh: "High (>75%)", 
            probLegendMedium: "Medium (30% - 75%)", 
            probLegendLow: "Low (<30%)",
        },
        te: {
            labelRank: "EAMCET ర్యాంక్:", labelBranch: "ఆసక్తిగల శాఖ (ఐచ్ఛికం):", selectBranch: "శాఖను ఎంచుకోండి",
            // NEW KEYS: Category Split
            labelQuota: "కోటా (ఐచ్ఛికం):", selectQuota: "కోటాను ఎంచుకోండి", 
            labelGender: "లింగం (ఐచ్ఛికం):", selectGender: "లింగాన్ని ఎంచుకోండి",

            labelDistrict: "జిల్లా (ఐచ్ఛికం):", selectDistrict: "జిల్లా ఎంచుకోండి", labelRegion: "ప్రాంతం (ఐచ్ఛికం):", selectRegion: "ప్రాంతం ఎంచుకోండి",
            labelTier: "టియర్ (ఐచ్ఛికం):", selectTier: "టియర్ ఎంచుకోండి", labelPlacementQuality: "ప్లేస్‌మెంట్ నాణ్యత (ఐచ్ఛికం):", selectQuality: "నాణ్యతను ఎంచుకోండి",

            // NEW KEY: Missing Data Switch
            showMissingDataLabel: "మిస్ అయిన డేటా ఉన్న కళాశాలలను చూపించు (కటాఫ్/ప్యాకేజ్/నాణ్యత)", 

            btnPredict: "కళాశాలలను అంచనా వేయి", btnClear: "ఫిల్టర్లు క్లియర్ చేయండి", disclaimerStrong: "అనుమతి:",
            disclaimerText: "గత సంవత్సరాల కటాఫ్ డేటా మరియు ట్రెండ్స్ ఆధారంగా అంచనా. వాస్తవ కటాఫ్లు దరఖాస్తుదారులు మరియు సీట్ల లభ్యతపై ఆధారపడి మారవచ్చు.",
            summaryTitle: "మీ ప్రతిపాదనలు", sortLabel: "ఫలితాలను సర్దుబాటు చేయండి:", selectAll: "అన్నింటిని ఎంచుకోండి",
            sortProbabilityDesc: "అవకాశం (ఎక్కువ నుండి తక్కువ)", sortProbabilityAsc: "అవకాశం (తక్కువ నుండి ఎక్కువ)",
            sortCutoffAsc: "కటాఫ్ ర్యాంక్ (తక్కువ నుండి ఎక్కువ)", sortCutoffDesc: "కటాఫ్ ర్యాంక్ (ఎక్కువ నుండి తక్కువ)",
            sortAvgPackageDesc: "సగటు ప్యాకేజ్ (ఎక్కువ నుండి తక్కువ)", sortAvgPackageAsc: "సగటు ప్యాకేజ్ (తక్కువ నుండి ఎక్కువ)",
            sortHighestPackageDesc: "అత్యధిక ప్యాకేజ్ (ఎక్కువ నుండి తక్కువ)", sortHighestPackageAsc: "అత్యధిక ప్యాకేజ్ (తక్కువ నుండి ఎక్కువ)",
            sortQualityDesc: "ప్లేస్‌మెంట్ నాణ్యత (ఉత్తమ నుంచి చెత్త)", sortQualityAsc: "ప్లేస్‌మెంట్ నాణ్యత (చెత్త నుంచి ఉత్తమ)",
            btnSavePdf: "PDFగా సేవ్ చెయ్యండి", btnSaveCsv: "CSVగా సేవ్ చెయ్యండి", loadingText: "కళాశాలలను లోడ్ చేయడం...",
            noInputText: "దయచేసి సరైన పాజిటివ్ ర్యాంక్ను నమోదు చేయండి లేదా కనీసం ఒక ఫిల్టర్‌ను ఎంచుకోండి.", 
            fetchError: "ఏదో పొరపాటు వచ్చింది. కన్సోల్‌ను తనిఖీ చేయండి.", retryFetch: "మళ్ళీ ప్రయత్నించండి",
            downloadNoData: "దయచేసి ఫలితాలను డౌన్లోడ్ చేయడానికి ముందుగా కళాశాలలను అంచనా వేయండి.",
            itemsSelected: "ఎంచుకోబడిన అంశాలు",
            
            // NEW KEYS: Probability Legend
            probLegendTitle: "అంచనా అవకాశం లెజెండ్:", 
            probLegendHigh: "ఎక్కువ (>75%)", 
            probLegendMedium: "మధ్యస్థం (30% - 75%)", 
            probLegendLow: "తక్కువ (<30%)",
        }
    };
    let currentLang = "en";

    // === Dark Mode Logic (UNCHANGED) ===
    const setTheme = (theme) => {
        if (theme === "dark") {
            body.classList.add("dark-mode");
            darkModeSwitch.checked = false;
            localStorage.setItem("theme", "dark");
        } else {
            body.classList.remove("dark-mode");
            darkModeSwitch.checked = true;
            localStorage.setItem("theme", "light");
        }
    };

    // Changed default to 'light'
    const savedTheme = localStorage.getItem("theme") || 'light'; 
    setTheme(savedTheme);

    darkModeSwitch.addEventListener("change", () => {
        setTheme(darkModeSwitch.checked ? "light" : "dark");
    });

    function showSpinner(show) {
        loadingSpinner.style.display = show ? "flex" : "none";
    }

    // === Translation Logic (UNCHANGED) ===
    function translateUI() {
        const elems = document.querySelectorAll("[data-lang-key]");
        elems.forEach((el) => {
            const key = el.getAttribute("data-lang-key");
            if (key && translations[currentLang] && translations[currentLang][key]) {
                if (el.tagName === "OPTION" || el.tagName === "LABEL") {
                    el.textContent = translations[currentLang][key];
                } else if (el.classList.contains("selected-items")) {
                    const dropdown = el.closest('.multiselect-dropdown');
                    const hiddenInputId = dropdown.getAttribute('data-id');
                    if (!document.getElementById(hiddenInputId).value) {
                        el.textContent = translations[currentLang][key];
                    }
                } else {
                    el.textContent = translations[currentLang][key];
                }
            }
        });
        if (currentLang === "te") {
            rankInput.placeholder = "మీ ర్యాంక్ ఇవ్వండి";
        } else {
            rankInput.placeholder = "Enter your rank";
        }
    }

    langSelect.addEventListener("change", (e) => {
        currentLang = e.target.value;
        translateUI();
    });

    // --- NEW: Category/Gender Split Logic ---
    function updateFinalCategory() {
        const quota = quotaInput.value;
        const gender = genderInput.value;
        
        if (quota) {
            const finalGender = gender || 'boys'; 
            finalCategoryInput.value = `${quota}_${finalGender}`;
        } else {
            finalCategoryInput.value = '';
        }
        if (rawData.length > 0) {
            if (filterTimeout) clearTimeout(filterTimeout);
            filterTimeout = setTimeout(filterAndRenderColleges, 300);
        }
    }
    // --- END Category/Gender Split Logic ---


    // === Multi-select Logic (UPDATED) ===
    function updateSelectedItemsDisplay(dropdown, selectedValues, selectedTexts = []) {
        const selectedItemsSpan = dropdown.querySelector(".selected-items");
        const placeholderKey = dropdown.getAttribute('data-placeholder-key');
        const placeholderText = translations[currentLang][placeholderKey] || "Select...";

        if (selectedValues.length === 0) {
            selectedItemsSpan.textContent = placeholderText;
        } else if (selectedValues.length === 1) {
            selectedItemsSpan.textContent = selectedTexts[0];
        } else {
            selectedItemsSpan.textContent = `${selectedValues.length} ${translations[currentLang].itemsSelected}`;
        }
    }

    function toggleDropdown(dropdown) {
        document.querySelectorAll('.multiselect-dropdown.open').forEach(openDropdown => {
            if (openDropdown !== dropdown) {
                openDropdown.classList.remove('open');
            }
        });

        dropdown.classList.toggle('open');
    }

    function initializeMultiselect(dropdown) {
        const id = dropdown.getAttribute('data-id');
        const hiddenInput = document.getElementById(id);
        const optionsList = dropdown.querySelector('.options-list');
        const dataSourceKey = optionsList.getAttribute('data-source');
        const data = optionData[dataSourceKey];
        const selectAllCheckbox = dropdown.querySelector('.select-all-checkbox');
        const isSingleSelect = dropdown.getAttribute('data-single-select') === 'true';

        // 1. Populate options
        optionsList.innerHTML = data.map(item => `
            <label>
                <input type="checkbox" data-text="${item.text}" value="${item.value}" />
                <span>${item.text}</span>
            </label>
        `).join('');

        // 2. Attach toggle listener
        dropdown.querySelector('.multiselect-input').addEventListener('click', (e) => {
            toggleDropdown(dropdown);
        });

        // 3. Attach change listener to checkboxes
        const checkboxes = dropdown.querySelectorAll('.options-list input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                
                if (isSingleSelect) {
                    hiddenInput.value = '';
                }

                if (isSingleSelect && checkbox.checked) {
                    checkboxes.forEach(cb => {
                        if (cb !== checkbox) cb.checked = false;
                    });
                    dropdown.classList.remove('open');
                }

                const selectedElements = Array.from(checkboxes).filter(cb => cb.checked);
                const selectedValues = selectedElements.map(cb => cb.value);
                const selectedTexts = selectedElements.map(cb => cb.getAttribute('data-text'));

                hiddenInput.value = selectedValues.join(',');
                updateSelectedItemsDisplay(dropdown, selectedValues, selectedTexts);
                
                // NEW: Trigger category combination on quota/gender change
                if (id === 'quota' || id === 'gender') {
                    updateFinalCategory();
                }

                if (selectAllCheckbox) {
                    selectAllCheckbox.checked = selectedValues.length === data.length;
                    selectAllCheckbox.indeterminate = (selectedValues.length > 0 && selectedValues.length < data.length);
                }

                // If placement filter is changed, re-filter results
                if (id === 'placementQualityFilter' && rawData.length > 0) {
                    if (filterTimeout) clearTimeout(filterTimeout);
                    filterTimeout = setTimeout(filterAndRenderColleges, 300);
                }
            });
        });

        // 4. Attach listener to 'Select All' checkbox
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', () => {
                const isChecked = selectAllCheckbox.checked;
                const selectedValues = [];
                const selectedTexts = [];
                checkboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                    if (isChecked) {
                        selectedValues.push(checkbox.value);
                        selectedTexts.push(checkbox.getAttribute('data-text'));
                    }
                });
                hiddenInput.value = selectedValues.join(',');
                updateSelectedItemsDisplay(dropdown, selectedValues, selectedTexts);
                selectAllCheckbox.indeterminate = false;

                if (id === 'placementQualityFilter' && rawData.length > 0) {
                    if (filterTimeout) clearTimeout(filterTimeout);
                    filterTimeout = setTimeout(filterAndRenderColleges, 300);
                }
            });
        } else if (isSingleSelect) {
            const selectAllLabel = dropdown.querySelector('.select-all-label');
            if (selectAllLabel) selectAllLabel.remove();
        }

        updateSelectedItemsDisplay(dropdown, []);
    }

    multiselectContainers.forEach(initializeMultiselect);
    translateUI(); // Initial translation

    document.addEventListener('click', (e) => {
        multiselectContainers.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    });

    // === Core Helper Functions (UNCHANGED) ===
    function multiSort(data, criteria) {
        if (!criteria) return data;
        const [key, direction] = criteria.split("-");
        const sortConfig = SortMap[key];
        if (!sortConfig) return data;
        const directionNum = direction === "asc" ? 1 : -1;
        const prop = sortConfig.prop;

        return data.sort((a, b) => {
            let valA = a[prop], valB = b[prop];
            if (sortConfig.qualityValue) {
                valA = qualityOrder[valA] || 0;
                valB = qualityOrder[valB] || 0;
            }
            if (valA == null && valB == null) return 0;
            if (valA == null) return 1;
            if (valB == null) return -1;
            if (valA < valB) return -1 * directionNum;
            if (valA > valB) return 1 * directionNum;
            return 0;
        });
    }

    function getProbabilityClass(probability) {
        if (probability === null || probability === undefined) return "";
        if (probability >= 75) return "high-prob";
        if (probability >= 30) return "medium-prob";
        return "low-prob";
    }

    function formatPackage(pkg) {
        if (pkg === null || pkg === undefined) return "N/A";
        return `₹${pkg.toFixed(2)} Lakhs`;
    }

    function getLocationDisplay(districtCode, region) {
        const fullDistrict = districtMap[districtCode] || districtCode || 'N/A';
        const regionName = region || 'N/A';
        return `${fullDistrict} (${regionName} Region)`;
    }


    // === Rendering Logic (UPDATED) ===
    function filterAndRenderColleges() {
        if (!rawData || rawData.length === 0) {
            collegeListDiv.innerHTML = `<p>${translations[currentLang].noDataText}</p>`;
            sortedData = null;
            return;
        }

        filteredData = [...rawData];
        const selectedQualitiesCSV = document.getElementById("placementQualityFilter").value;

        if (selectedQualitiesCSV) {
            const selectedQualities = selectedQualitiesCSV.toLowerCase().split(',');

            filteredData = filteredData.filter(college =>
                college.placementDriveQuality && selectedQualities.includes(college.placementDriveQuality.toLowerCase())
            );
        }

        const selectedSort = sortBySelect.value || (rawData[0].probability !== null ? "probability-desc" : "cutoff-asc");
        sortBySelect.value = selectedSort;
        sortedData = multiSort(filteredData, selectedSort);

        renderColleges();
    }

    function renderColleges() {
        collegeListDiv.innerHTML = "";
        
        // Remove existing legend before rendering
        const existingLegend = document.querySelector('.probability-legend');
        if (existingLegend) existingLegend.remove();


        if (!sortedData || sortedData.length === 0) {
            collegeListDiv.innerHTML = `<p>${translations[currentLang].noDataText}</p>`;
            return;
        }

        // Determine if probability should be shown based on data presence
        const showProbability = sortedData[0].probability !== null && sortedData[0].probability !== undefined;
        
        // NEW: Add Probability Legend to the top of the results if in Prediction Mode
        if (showProbability) {
            const legendHtml = `
                <div class="probability-legend">
                    <strong>${translations[currentLang].probLegendTitle}</strong>
                    <span class="high-prob">${translations[currentLang].probLegendHigh}</span> | 
                    <span class="medium-prob">${translations[currentLang].probLegendMedium}</span> | 
                    <span class="low-prob">${translations[currentLang].probLegendLow}</span>
                </div>
            `;
            // Insert the legend before the results list
            const resultsDiv = document.getElementById("results");
            resultsDiv.insertBefore(document.createRange().createContextualFragment(legendHtml), collegeListDiv);
        }

        // Adjust column headings based on if rank was provided
        const cutoffLabel = showProbability ? "Cutoff Rank" : "Last Year Cutoff";

        sortedData.forEach((college) => {
            const card = document.createElement("div");
            card.classList.add("college-card");

            const probability = college.probability;
            
            // NEW: Get the category used for THIS college result (comes from DTO)
            const resultCategoryValue = college.category || finalCategoryInput.value; 
            const categoryText = getCategoryText(resultCategoryValue);
            const categoryDisplay = categoryText ? `(${categoryText})` : '';

            const collegeName = college.institution_name || college.name || "Unknown College";
            
            // ⭐ FINAL CUTOFF DISPLAY FIX: Show "Data Not Available" for null/zero.
            // This is the correct logic to handle missing data and prevent 0 display.
            const cutoffValue = (college.cutoff !== null && college.cutoff !== undefined && college.cutoff > 0) 
                ? college.cutoff.toLocaleString() 
                : "Data Not Available";
                
            const probabilityValue = probability !== null && probability !== undefined ? `${probability.toFixed(0)}%` : "Can't say";
            const probClass = probability !== null ? getProbabilityClass(probability) : "";
            const avgPackage = formatPackage(college.averagePackage);
            const highPackage = formatPackage(college.highestPackage);
            const placementQuality = college.placementDriveQuality || "N/A";

            const mapsQuery = encodeURIComponent(collegeName + " EAMCET college");
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

            const locationDisplay = getLocationDisplay(college.district, college.region);

            const branchText = college.branch || "N/A";
            const fullBranchDisplay = `<strong>Branch:</strong> ${branchText} <span style="font-weight: 700;">${categoryDisplay}</span>`;
            
            // NEW: Dynamic Cutoff Labeling
            const fullCutoffLabel = cutoffLabel + (categoryDisplay || '');

            card.innerHTML = `
                <h3>
                    <span class="college-title-span">${collegeName}</span>
                    <div class="college-links">
                        <a href="${mapsUrl}" target="_blank" title="View location on map">
                            <i class="fas fa-map-marker-alt"></i>Location
                        </a>
                    </div>
                </h3>
                <div class="branch-info">${fullBranchDisplay}</div>

                <div class="college-details-grid">
                    <div><strong>${fullCutoffLabel}:</strong><span class="value-display">${cutoffValue}</span></div>
                    <div><strong>Avg. Package:</strong><span class="value-display">${avgPackage}</span></div>

                    <div class="placement-quality"><strong>Placement Drive Quality:</strong><span class="value-display">${placementQuality}</span></div>

                    ${showProbability ? 
                        `<div><strong>Predicted Chance:</strong><span class="probability-display value-display ${probClass}">${probabilityValue}</span></div>`
                        : '<div></div>' 
                    }
                    <div><strong>Highest Package:</strong><span class="value-display">${highPackage}</span></div>
                    <div></div>
                </div>

                <p class="college-card-footer">
                    <span><strong>Inst. Code:</strong> ${college.instcode || "N/A"}</span>
                    <span><strong>Location:</strong> ${locationDisplay}</span>
                    <span><strong>Tier:</strong> ${college.tier || "N/A"}</span>
                </p>
            `;
            collegeListDiv.appendChild(card);
        });
    }

    sortBySelect.addEventListener("change", filterAndRenderColleges);

    // === Display/Prediction Logic (UPDATED) ===
    function displayInputSummary(inputs) {
        const { rank, branch, category, district, region, tier, placementQualityFilter, showMissingData } = inputs;
        
        const getLabel = (value, dataSource) => {
            if (!value) return 'N/A';
            const values = value.split(',');
            // If the source is 'categories' (the combined value), use the custom helper
            if (dataSource === 'categories') return getCategoryText(value) || value;

            const options = optionData[dataSource];
            return values.map(v => {
                const option = options.find(o => o.value === v);
                if (dataSource === 'districts') return districtMap[v] || v;
                return option ? option.text : v;
            }).join(', ');
        };

        const rankDisplay = rank !== null && rank !== undefined ? rank : 'N/A (Search Only)';
        const branchDisplay = getLabel(branch, 'branches');
        const categoryDisplay = getCategoryText(category) || 'N/A'; // Use custom helper for combined value
        const districtDisplay = getLabel(district, 'districts');
        const regionDisplay = getLabel(region, 'regions');
        const tierDisplay = getLabel(tier, 'tiers');
        const qualityDisplay = getLabel(placementQualityFilter, 'placementQuality');

        let html = `
            <h2>${translations[currentLang].summaryTitle}</h2>
            <div class="summary-grid">
                <p><strong>EAMCET Rank:</strong> ${rankDisplay}</p>
                <p><strong>Desired Branch(es):</strong> ${branchDisplay}</p>
                <p><strong>Category/Quota:</strong> ${categoryDisplay}</p>
                <p><strong>District(s):</strong> ${districtDisplay}</p>
                <p><strong>Region(s):</strong> ${regionDisplay}</p>
                <p><strong>Tier(s):</strong> ${tierDisplay}</p>
                <p><strong>Placement Quality Filter(s):</strong> ${qualityDisplay}</p>
                <p><strong>Missing Data:</strong> ${showMissingData ? 'Shown' : 'Hidden'}</p>
            </div>
        `;

        inputSummaryDiv.innerHTML = html;
        inputSummaryDiv.style.display = 'block';
    }

    document.getElementById("predictButton").addEventListener("click", function (e) {
        e.preventDefault();
        collegeListDiv.innerHTML = `<p>${translations[currentLang].loadingText}</p>`;
        
        // Remove old legend when new search starts
        const existingLegend = document.querySelector('.probability-legend');
        if (existingLegend) existingLegend.remove();
        
        resultsControlsDiv.style.display = "none";
        showSpinner(true);

        // 1. Get all inputs
        const rankInputVal = rankInput.value.trim();
        const rank = rankInputVal ? parseInt(rankInputVal) : null;
        const branch = document.getElementById("desiredBranch").value || null;
        const category = finalCategoryInput.value || null; // Use the COMBINED category input
        const district = document.getElementById("district").value || null;
        const region = document.getElementById("region").value || null;
        const tier = document.getElementById("tier").value || null;
        const placementQualityFilter = document.getElementById("placementQualityFilter").value || null;
        const showMissingData = showMissingDataCheckbox.checked; // NEW FLAG
        
        // 2. MODIFIED VALIDATION LOGIC
        const isRankValid = rank !== null && !isNaN(rank) && rank > 0;
        const hasFilters = branch || category || district || region || tier || placementQualityFilter;

        if (!isRankValid && !hasFilters) {
            collegeListDiv.innerHTML = `<p>${translations[currentLang].noInputText}</p>`;
            inputSummaryDiv.style.display = 'none';
            showSpinner(false);
            return;
        }

        // 3. Construct Request Data - Pass only valid/selected values.
        const requestData = {};
        if (isRankValid) requestData.rank = rank;
        if (branch) requestData.branch = branch;
        if (category) requestData.category = category;
        if (district) requestData.district = district;
        if (region) requestData.region = region;
        if (tier) requestData.tier = tier;
        if (placementQualityFilter) requestData.placementQualityFilter = placementQualityFilter;
        requestData.showMissingData = showMissingData; // NEW: Pass the missing data flag

        // ⭐ FINAL UPDATED FETCH URL: Using the public Render placeholder structure
        fetch("https://theeamcetcollegeprediction-2.onrender.com/api/api/predict-colleges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        })
            .then((response) => {
                if (!response.ok) throw new Error("API error");
                return response.json();
            })
            .then((data) => {
                rawData = data;
                resultsControlsDiv.style.display = "flex";
                if (!rawData || rawData.length === 0) {
                    collegeListDiv.innerHTML = `<p>${translations[currentLang].noDataText}</p>`;
                    inputSummaryDiv.style.display = 'none';
                    showSpinner(false);
                    return;
                }
                
                // Pass all request data, including the new flag
                displayInputSummary(requestData); 
                
                filterAndRenderColleges();
                showSpinner(false);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                collegeListDiv.innerHTML = `
                    <p>${translations[currentLang].fetchError}</p>
                    <button id="retryBtn" class="btn-primary">${translations[currentLang].retryFetch}</button>
                `;
                inputSummaryDiv.style.display = 'none';
                showSpinner(false);
                document.getElementById("retryBtn").addEventListener("click", () => {
                    document.getElementById("predictButton").click();
                });
            });
    });

    document.getElementById("clearButton").addEventListener("click", () => {
        predictForm.reset();
        collegeListDiv.innerHTML = "";
        inputSummaryDiv.style.display = "none";
        resultsControlsDiv.style.display = "none";
        rawData = [];
        filteredData = [];
        sortedData = null;
        
        // Reset the missing data checkbox to default (checked)
        showMissingDataCheckbox.checked = true;

        multiselectContainers.forEach(dropdown => {
            const hiddenInput = document.getElementById(dropdown.getAttribute('data-id'));
            hiddenInput.value = '';
            dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            
            const selectAllCheckbox = dropdown.querySelector('.select-all-checkbox');
            if(selectAllCheckbox) selectAllCheckbox.indeterminate = false;

            updateSelectedItemsDisplay(dropdown, []);
        });
        
        // Manually ensure the final category input is cleared
        finalCategoryInput.value = '';
    });

    saveCsvButton.addEventListener("click", () => {
        if (!sortedData || sortedData.length === 0) {
            showMessage(translations[currentLang].downloadNoData);
            return;
        }

        const csvHeader = [
            "Institution Name", "Branch", "Cutoff Rank", "Predicted Chance (%)",
            "Placement Drive Quality", "Average Package (Lakhs)", "Highest Package (Lakhs)",
            "Institution Code", "Location (District/Region)", "Region", "Tier",
        ];

        const csvRows = sortedData.map((college) => {
            const locationDisplay = getLocationDisplay(college.district, college.region);
            return [
                college.institution_name || college.name || "N/A",
                college.branch || "N/A",
                college.cutoff !== null && college.cutoff !== undefined ? college.cutoff : "N/A",
                college.probability !== null && college.probability !== undefined ? college.probability.toFixed(0) : "N/A",
                college.placementDriveQuality || "N/A",
                college.averagePackage !== null && college.averagePackage !== undefined ? college.averagePackage.toFixed(2) : "N/A",
                college.highestPackage !== null && college.highestPackage !== undefined ? college.highestPackage.toFixed(2) : "N/A",
                college.instcode || "N/A",
                locationDisplay,
                college.region || "N/A",
                college.tier || "N/A",
            ]
                .map((field) => `"${field}"`)
                .join(",");
        });

        const csvContent = [csvHeader.join(","), ...csvRows].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "EAMCET_College_Predictions.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        document.querySelector('#downloadMenu').style.display = "none";
    });

    downloadIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!sortedData || sortedData.length === 0) {
            showMessage(translations[currentLang].downloadNoData);
            return;
        }
        const menu = document.querySelector('#downloadMenu');
        menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", (e) => {
        const menu = document.querySelector('#downloadMenu');
        if (menu && !downloadIcon.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = "none";
        }
    });

    document.getElementById("savePdfButton").addEventListener("click", () => {
        if (sortedData && sortedData.length > 0) window.print();
        
        document.querySelector('#downloadMenu').style.display = "none";
    });


    function showMessage(msg) {
        let existing = document.getElementById("messagePopup");
        if (existing) existing.remove();

        const popup = document.createElement("div");
        popup.id = "messagePopup";
        popup.textContent = msg;

        document.body.appendChild(popup);

        setTimeout(() => {
            if (popup.parentNode) popup.parentNode.removeChild(popup);
        }, 3000);
    }
});