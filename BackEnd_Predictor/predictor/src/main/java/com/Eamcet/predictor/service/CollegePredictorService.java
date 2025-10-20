package com.Eamcet.predictor.service;

import com.Eamcet.predictor.model.RawTable;
import com.Eamcet.predictor.repository.CollegeRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CollegePredictorService {

    private final CollegeRepository repo;
    private static final int REQUIRED_TOTAL_COUNT = 95;

    private static final Map<String, Integer> TIER_SORT_MAP = Map.of(
            "Tier 1", 1,
            "Tier 2", 2,
            "Tier 3", 3
    );

    // --- (Sets for ALL_CATEGORIES and ALL_BRANCHES remain the same) ---
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

    // NEW LOGIC: Added predictionTier to store "Assured", "Reachable", etc.
    public static class CollegeResult {
        private String name; private String region; private String place; private String affl;
        private String branch; private Integer cutoff; private String instcode; private Double probability;
        private String district; private String tier; private String category;
        private Double highestPackage; private Double averagePackage; private String placementDriveQuality;
        private String predictionTier; // New field

        public CollegeResult(String name, String region, String place, String affl, String branch,
                             Integer cutoff, String instcode, Double probability, String district, String tier,
                             Double highestPackage, Double averagePackage, String placementDriveQuality, String category, String predictionTier) {
            this.name = name; this.region = region; this.place = place; this.affl = affl;
            this.branch = branch; this.cutoff = cutoff; this.instcode = instcode;
            this.probability = probability; this.district = district; this.tier = tier;
            this.highestPackage = highestPackage; this.averagePackage = averagePackage;
            this.placementDriveQuality = placementDriveQuality;
            this.category = category;
            this.predictionTier = predictionTier; // New field
        }

        // --- (Getters for all fields, including the new one) ---
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
        public Double getHighestPackage() { return highestPackage; }
        public Double getAveragePackage() { return averagePackage; }
        public String getPlacementDriveQuality() { return placementDriveQuality; }
        public String getCategory() { return category; }
        public String getPredictionTier() { return predictionTier; }
    }

    private static class FilterInput {
        // --- (This class remains the same) ---
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
            String placementQuality) {

        if (rank != null && rank > 0) {
            return predict(rank, branch, category, district, region, tier, placementQuality);
        }
        else {
            return filterAndSearch(branch, category, district, region, tier, placementQuality);
        }
    }


    private List<CollegeResult> filterAndSearch(
            // --- (This method remains the same, as it's for non-rank-based searches) ---
            String branch, String category, String district, String region, String tier,
            String placementQuality) {

        final FilterInput filters = setupFilters(branch, category, district, region, tier, placementQuality);

        Specification<RawTable> spec = buildSpecifications(filters);
        List<RawTable> rawTables = repo.findAll(spec);

        if (rawTables.isEmpty()) {
            return Collections.emptyList();
        }

        final String displayCategory = filters.userCategories.isEmpty() ? "oc_boys" : filters.userCategories.iterator().next();

        List<CollegeResult> finalResults = rawTables.stream()
                .filter(c -> filters.effectiveBranches.contains(c.getBranchCode()))
                .map(rawTable -> {
                    Integer cutoff = getCutoffForCategory(rawTable, displayCategory);

                    return new CollegeResult(
                            rawTable.getInstitution_name(), rawTable.getRegion(), rawTable.getPlace(),
                            rawTable.getAffl(), rawTable.getBranchCode(), cutoff, rawTable.getInstcode(),
                            null, // No probability for filter search
                            rawTable.getDistrict(), rawTable.getTier(),
                            rawTable.getHighestPackage(), rawTable.getAveragePackage(),
                            rawTable.getPlacementDriveQuality(),
                            displayCategory,
                            null // No prediction tier for filter search
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
            String placementQuality) {

        if (rank <= 0) throw new IllegalArgumentException("Rank must be > 0");

        final FilterInput filters = setupFilters(branch, category, district, region, tier, placementQuality);

        Specification<RawTable> spec = buildSpecifications(filters);
        List<RawTable> rawTables = repo.findAll(spec);

        if (rawTables.isEmpty()) {
            return Collections.emptyList();
        }

        List<CollegeResult> predictableResults = rawTables.stream()
                .filter(c -> filters.effectiveBranches.contains(c.getBranchCode()))
                .flatMap(rawTable -> filters.effectiveCategories.stream().map(currentCategory -> {
                    Integer cutoff = getCutoffForCategory(rawTable, currentCategory);

                    // NEW LOGIC: Skip if cutoff data is unavailable, as prediction is impossible.
                    if (cutoff == null || cutoff == 0) {
                        return null;
                    }

                    Double probability = null;
                    String predictionTier = null;

                    // NEW LOGIC: Define boundaries for each prediction tier based on percentages.
                    double assuredBoundary = cutoff * 0.95;
                    double reachableBoundary = cutoff * 1.10;
                    double ambitiousBoundary = cutoff * 1.25;

                    if (rank <= assuredBoundary) {
                        predictionTier = "Assured";
                        // Probability from 85% to 99%
                        double score = ((double) cutoff - rank) / cutoff;
                        probability = 85.0 + 14.0 * score;
                        probability = Math.min(99.0, probability); // Cap at 99%

                    } else if (rank <= reachableBoundary) {
                        predictionTier = "Reachable";
                        // Probability from 40% to 85%
                        double range = reachableBoundary - assuredBoundary;
                        double score = (reachableBoundary - rank) / range;
                        probability = 40.0 + 45.0 * score;

                    } else if (rank <= ambitiousBoundary) {
                        predictionTier = "Ambitious";
                        // Probability from 5% to 40%
                        double range = ambitiousBoundary - reachableBoundary;
                        double score = (ambitiousBoundary - rank) / range;
                        probability = 5.0 + 35.0 * score;

                    }

                    // If none of the above, probability remains null, and the college is filtered out.
                    if (probability == null) {
                        return null;
                    }

                    return new CollegeResult(
                            rawTable.getInstitution_name(), rawTable.getRegion(), rawTable.getPlace(),
                            rawTable.getAffl(), rawTable.getBranchCode(), cutoff, rawTable.getInstcode(),
                            probability, rawTable.getDistrict(), rawTable.getTier(),
                            rawTable.getHighestPackage(), rawTable.getAveragePackage(),
                            rawTable.getPlacementDriveQuality(),
                            currentCategory,
                            predictionTier
                    );
                }))
                .filter(Objects::nonNull) // Filter out null results from the map
                .filter(result -> filters.userQualities.isEmpty() || filters.userQualities.contains(result.getPlacementDriveQuality()))
                .collect(Collectors.toList());


        // NEW LOGIC: Updated sorting to prioritize probability, then college quality, then cutoff.
        predictableResults.sort(
                Comparator.comparing(CollegeResult::getProbability, Comparator.reverseOrder())
                        .thenComparing(cr -> TIER_SORT_MAP.getOrDefault(cr.getTier(), 99))
                        .thenComparing(CollegeResult::getCutoff, Comparator.nullsLast(Integer::compareTo))
        );

        return predictableResults.stream().limit(REQUIRED_TOTAL_COUNT).collect(Collectors.toList());
    }

    // --- (The helper methods setupFilters, buildSpecifications, parseCsvInput, and getCutoffForCategory remain the same) ---

    private FilterInput setupFilters(
            String branch, String category, String district, String region, String tier,
            String placementQuality) {

        FilterInput filters = new FilterInput();

        filters.userBranches = parseCsvInput(branch);
        filters.userCategories = parseCsvInput(category);
        filters.userDistricts = parseCsvInput(district);
        filters.userRegions = parseCsvInput(region);
        filters.userTiers = parseCsvInput(tier);
        filters.userQualities = parseCsvInput(placementQuality);

        filters.effectiveBranches = filters.userBranches.isEmpty() ? ALL_BRANCHES : filters.userBranches;
        filters.effectiveCategories = filters.userCategories.isEmpty() ? ALL_CATEGORIES : filters.userCategories;

        String genderPart = filters.userCategories.stream()
                .filter(c -> c.endsWith("_boys") || c.endsWith("_girls"))
                .findFirst()
                .map(s -> s.endsWith("_boys") ? "boys" : "girls")
                .orElse(null);
        filters.requestedGender = genderPart;


        return filters;
    }


    private Specification<RawTable> buildSpecifications(FilterInput filters) {
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

    private Integer getCutoffForCategory(RawTable c, String category) {
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