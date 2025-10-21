package com.Eamcet.predictor.service;

import com.Eamcet.predictor.dto.CollegeDataDto;
import com.Eamcet.predictor.exception.InvalidRequestException;
import com.Eamcet.predictor.model.College;
import com.Eamcet.predictor.repository.CollegeRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CollegePredictorService {

    private final CollegeRepository repo;
    private static final int REQUIRED_TOTAL_COUNT = 95;

    private static final Map<String, Integer> TIER_SORT_MAP = Map.of(
            "Tier 1", 1,
            "Tier 2", 2,
            "Tier 3", 3
    );

    private static final Set<String> ALL_CATEGORIES = Set.of(
            "oc_boys", "oc_girls", "sc_boys", "sc_girls", "st_boys", "st_girls",
            "bca_boys", "bca_girls", "bcb_boys", "bcb_girls", "bcc_boys", "bcc_girls",
            "bcd_boys", "bcd_girls", "bce_boys", "bce_girls", "oc_ews_boys", "oc_ews_girls"
    );
    private static final Set<String> ALL_BRANCHES = Set.of(
            "Civil Engineering", "Computer Science & Engineering", "Electronics & Communication Engineering",
            "Electrical & Electronics Engineering", "Mechanical Engineering", "Information Technology",
            "Artificial Intelligence & Machine Learning", "Artificial Intelligence & Data Science",
            "CSE (Artificial Intelligence)", "CSE (Cyber Security)", "CSE (Data Science)",
            "CSE (AI & ML Specialization)", "Chemical Engineering", "Biotechnology",
            "Agricultural Engineering", "Mining Engineering", "Metallurgical Engineering",
            "Aerospace Engineering", "Automobile Engineering", "Internet of Things",
            "B.Pharm", "Doctor of Pharmacy (Pharm.D)", "Electronics & Instrumentation Engineering",
            "CSE (Business Systems)", "Geo-Informatics Engineering"
    );

    public CollegePredictorService(CollegeRepository repo) {
        this.repo = repo;
    }

    public static class CollegeResult {
        private String name; private String region; private String place; private String affl;
        private String branch; private Integer cutoff; private String instcode; private Double probability;
        private String district; private String tier; private String category;
        private Double highestPackage; private Double averagePackage; private String placementDriveQuality;
        private String predictionTier;

        public CollegeResult(String name, String region, String place, String affl, String branch,
                             Integer cutoff, String instcode, Double probability, String district, String tier,
                             Double highestPackage, Double averagePackage, String placementDriveQuality, String category, String predictionTier) {
            this.name = name; this.region = region; this.place = place; this.affl = affl;
            this.branch = branch; this.cutoff = cutoff; this.instcode = instcode;
            this.probability = probability; this.district = district; this.tier = tier;
            this.highestPackage = highestPackage; this.averagePackage = averagePackage;
            this.placementDriveQuality = placementDriveQuality;
            this.category = category;
            this.predictionTier = predictionTier;
        }

        public String getName() { return name; }
        public String getRegion() { return region; }
        public String getPlace() { return place; }
        public String getAffl() { return affl; }
        public String getBranch() { return branch; }
        public Integer getCutoff() { return cutoff; }
        public String getInstcode() { return instcode; }
        public Double getProbability() { return probability; }
        public String getDistrict() { return district; }
        public String getTier() { return tier; }
        public String getCategory() { return category; }
        public Double getHighestPackage() { return highestPackage; }
        public Double getAveragePackage() { return averagePackage; }
        public String getPlacementDriveQuality() { return placementDriveQuality; }
        public String getPredictionTier() { return predictionTier; }
    }

    private static class FilterInput {
        Set<String> userBranches;
        Set<String> userCategories;
        Set<String> userDistricts;
        Set<String> userRegions;
        Set<String> userTiers;
        Set<String> userQualities;
        Set<String> effectiveBranches;
        Set<String> effectiveCategories;
        String requestedGender;
    }

    public List<CollegeResult> findColleges(
            Integer rank, String branch, String category, String district, String region, String tier,
            String placementQuality, String gender) {

        if (rank != null && rank > 0) {
            return predict(rank, branch, category, district, region, tier, placementQuality, gender);
        } else {
            return filterAndSearch(branch, category, district, region, tier, placementQuality, gender);
        }
    }

    /**
     * Fetches all college-branch records from the database.
     * This is used to provide data for the frontend analytics and map features.
     * @return A list of all colleges with their general data.
     */
    public List<CollegeDataDto> getAllColleges() {
        return repo.findAll()
                .stream()
                .map(CollegeDataDto::new)
                .collect(Collectors.toList());
    }

    private List<CollegeResult> filterAndSearch(
            String branch, String category, String district, String region, String tier,
            String placementQuality, String gender) {

        final FilterInput filters = setupFilters(branch, category, district, region, tier, placementQuality, gender);

        Specification<College> spec = buildSpecifications(filters);
        List<College> colleges = repo.findAll(spec);

        if (colleges.isEmpty()) {
            return Collections.emptyList();
        }

        // Use the first effective category for display purposes
        final String displayCategory = filters.effectiveCategories.isEmpty() ? "oc_boys" : filters.effectiveCategories.iterator().next();

        List<CollegeResult> finalResults = colleges.stream()
                .filter(c -> filters.effectiveBranches.contains(c.getBranchCode()))
                .map(college -> {
                    Integer cutoff = getCutoffForCategory(college, displayCategory);

                    return new CollegeResult(
                            college.getInstitution_name(), college.getRegion(), college.getPlace(),
                            college.getAffl(), college.getBranchCode(), cutoff, college.getInstcode(),
                            null,
                            college.getDistrict(), college.getTier(),
                            college.getHighestPackage(), college.getAveragePackage(),
                            college.getPlacementDriveQuality(),
                            displayCategory,
                            null
                    );
                })
                .filter(result -> filters.userQualities.isEmpty() || filters.userQualities.contains(result.getPlacementDriveQuality()))
                .collect(Collectors.toList());


        return finalResults.stream()
                .sorted(
                        Comparator.comparing(CollegeResult::getCutoff, Comparator.nullsLast(Integer::compareTo))
                                .thenComparing(CollegeResult::getName)
                )
                .limit(REQUIRED_TOTAL_COUNT)
                .collect(Collectors.toList());
    }

    public List<CollegeResult> predict(
            final int rank, String branch, String category, String district, String region, String tier,
            String placementQuality, String gender) {

        if (rank <= 0) throw new InvalidRequestException("Rank must be a positive number.");

        final FilterInput filters = setupFilters(branch, category, district, region, tier, placementQuality, gender);

        Specification<College> spec = buildSpecifications(filters);
        List<College> colleges = repo.findAll(spec);

        if (colleges.isEmpty()) {
            return Collections.emptyList();
        }

        List<CollegeResult> predictableResults = colleges.stream()
                .filter(c -> filters.effectiveBranches.contains(c.getBranchCode()))
                .flatMap(college -> filters.effectiveCategories.stream().map(currentCategory -> {
                    Integer cutoff = getCutoffForCategory(college, currentCategory);

                    if (cutoff == null || cutoff == 0) {
                        return null;
                    }

                    Double probability = null;
                    String predictionTier = null;

                    double assuredBoundary = cutoff * 0.95;
                    double reachableBoundary = cutoff * 1.10;
                    double ambitiousBoundary = cutoff * 1.25;

                    if (rank <= assuredBoundary) {
                        predictionTier = "Assured";
                        double score = ((double) cutoff - rank) / cutoff;
                        probability = 85.0 + 14.0 * score;
                        probability = Math.min(99.0, probability);

                    } else if (rank <= reachableBoundary) {
                        predictionTier = "Reachable";
                        double range = reachableBoundary - assuredBoundary;
                        double score = (reachableBoundary - rank) / range;
                        probability = 40.0 + 45.0 * score;

                    } else if (rank <= ambitiousBoundary) {
                        predictionTier = "Ambitious";
                        double range = ambitiousBoundary - reachableBoundary;
                        double score = (ambitiousBoundary - rank) / range;
                        probability = 5.0 + 35.0 * score;

                    }

                    if (probability == null) {
                        return null;
                    }

                    return new CollegeResult(
                            college.getInstitution_name(), college.getRegion(), college.getPlace(),
                            college.getAffl(), college.getBranchCode(), cutoff, college.getInstcode(),
                            probability, college.getDistrict(), college.getTier(),
                            college.getHighestPackage(), college.getAveragePackage(),
                            college.getPlacementDriveQuality(),
                            currentCategory,
                            predictionTier
                    );
                }))
                .filter(Objects::nonNull)
                .filter(result -> filters.userQualities.isEmpty() || filters.userQualities.contains(result.getPlacementDriveQuality()))
                .collect(Collectors.toList());


        predictableResults.sort(
                Comparator.comparing(CollegeResult::getProbability, Comparator.reverseOrder())
                        .thenComparing(cr -> TIER_SORT_MAP.getOrDefault(cr.getTier(), 99))
                        .thenComparing(CollegeResult::getCutoff, Comparator.nullsLast(Integer::compareTo))
        );

        return predictableResults.stream().limit(REQUIRED_TOTAL_COUNT).collect(Collectors.toList());
    }

    private FilterInput setupFilters(
            String branch, String category, String district, String region, String tier,
            String placementQuality, String gender) {

        FilterInput filters = new FilterInput();

        filters.userBranches = parseCsvInput(branch);
        // filters.userCategories is now dynamically set below
        filters.userDistricts = parseCsvInput(district);
        filters.userRegions = parseCsvInput(region);
        filters.userTiers = parseCsvInput(tier);
        filters.userQualities = parseCsvInput(placementQuality);

        filters.effectiveBranches = filters.userBranches.isEmpty() ? ALL_BRANCHES : filters.userBranches;

        // ----------------------------------------------------------------------
        // START NEW CATEGORY COMBINATION LOGIC
        // ----------------------------------------------------------------------

        Set<String> combinedCategories = new HashSet<>();
        Set<String> quotaInputs = parseCsvInput(category);
        String genderInput = gender;

        if (!quotaInputs.isEmpty() && genderInput != null) {
            // Case 1: Quota (e.g., oc) AND Gender (e.g., boys) are present. -> Result: oc_boys
            for (String quota : quotaInputs) {
                combinedCategories.add(quota.toLowerCase() + "_" + genderInput.toLowerCase());
            }
        } else if (!quotaInputs.isEmpty()) {
            // Case 2: Only Quota is present. Assume both genders are possible for that quota.
            for (String quota : quotaInputs) {
                combinedCategories.add(quota.toLowerCase() + "_boys");
                combinedCategories.add(quota.toLowerCase() + "_girls");
            }
        }

        // Set the base category list. If we have generated combined categories, use them.
        // Otherwise, if the quota input was empty (Case 3), use ALL_CATEGORIES.
        Set<String> initialCategories = combinedCategories.isEmpty() ? ALL_CATEGORIES : combinedCategories;

        // ----------------------------------------------------------------------
        // END NEW CATEGORY COMBINATION LOGIC
        // ----------------------------------------------------------------------

        // 3. APPLY the GENDER filter (This is necessary to handle multi-select and clean up
        //    Case 2 if only 'boys' or 'girls' was selected via the dedicated gender filter).
        if ("boys".equalsIgnoreCase(gender)) {
            // Only keep boy categories
            filters.effectiveCategories = initialCategories.stream()
                    .filter(c -> c.endsWith("_boys")) // Only keep '_boys' categories
                    .collect(Collectors.toSet());
        } else if ("girls".equalsIgnoreCase(gender)) {
            // Only keep girl categories
            filters.effectiveCategories = initialCategories.stream()
                    .filter(c -> c.endsWith("_girls")) // Only keep '_girls' categories
                    .collect(Collectors.toSet());
        } else {
            // No specific gender filter, use all combined or all existing categories
            filters.effectiveCategories = initialCategories;
        }

        // Set the flag for the JPA specification to exclude Women's colleges if gender is "boys"
        filters.requestedGender = (gender != null && gender.equalsIgnoreCase("boys")) ? "boys" : null;

        return filters;
    }


    private Specification<College> buildSpecifications(FilterInput filters) {
        Set<String> districts = filters.userDistricts;
        Set<String> regions = filters.userRegions;
        Set<String> tiers = filters.userTiers;
        String requestedGender = filters.requestedGender;

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (!districts.isEmpty()) {
                predicates.add(root.get("district").as(String.class).in(districts));
            }
            if (!regions.isEmpty()) {
                predicates.add(root.get("region").as(String.class).in(regions));
            }
            if (!tiers.isEmpty()) {
                predicates.add(root.get("tier").as(String.class).in(tiers));
            }
            if ("boys".equals(requestedGender)) {
                predicates.add(criteriaBuilder.notEqual(root.get("division"), "W"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Set<String> parseCsvInput(String csv) {
        if (csv == null || csv.isBlank()) {
            return Collections.emptySet();
        }
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    private Integer getCutoffForCategory(College c, String category) {
        if (category == null) return null;

        return switch (category.toLowerCase()) {
            case "oc_boys" -> c.getOcBoys();
            case "oc_girls" -> c.getOcGirls();
            case "sc_boys" -> c.getScBoys();
            case "sc_girls" -> c.getScGirls();
            case "st_boys" -> c.getStBoys();
            case "st_girls" -> c.getStGirls();
            case "bca_boys" -> c.getBcaBoys();
            case "bca_girls" -> c.getBcaGirls();
            case "bcb_boys" -> c.getBcbBoys();
            case "bcb_girls" -> c.getBcbGirls();
            case "bcc_boys" -> c.getBccBoys();
            case "bcc_girls" -> c.getBccGirls();
            case "bcd_boys" -> c.getBcdBoys();
            case "bcd_girls" -> c.getBcdGirls();
            case "bce_boys" -> c.getBceBoys();
            case "bce_girls" -> c.getBceGirls();
            case "oc_ews_boys" -> c.getOcEwsBoys();
            case "oc_ews_girls" -> c.getOcEwsGirls();
            default -> null;
        };
    }
}