package com.Eamcet.predictor.service;

import com.Eamcet.predictor.model.RawTable;
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

    private static final int EFFECTIVE_MAX_DIFF = 6000;

    private static final int MINIMUM_CUTOFF_BUFFER = 10000;

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

        public CollegeResult(String name, String region, String place, String affl, String branch,
                             Integer cutoff, String instcode, Double probability, String district, String tier,
                             Double highestPackage, Double averagePackage, String placementDriveQuality, String category) {
            this.name = name; this.region = region; this.place = place; this.affl = affl;
            this.branch = branch; this.cutoff = cutoff; this.instcode = instcode;
            this.probability = probability; this.district = district; this.tier = tier;
            this.highestPackage = highestPackage; this.averagePackage = averagePackage;
            this.placementDriveQuality = placementDriveQuality;
            this.category = category;
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
        public Double getHighestPackage() { return highestPackage; }
        public Double getAveragePackage() { return averagePackage; }
        public String getPlacementDriveQuality() { return placementDriveQuality; }
        public String getCategory() { return category; }
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
            String placementQuality) {

        if (rank != null && rank > 0) {
            return predict(rank, branch, category, district, region, tier, placementQuality);
        }
        else {
            return filterAndSearch(branch, category, district, region, tier, placementQuality);
        }
    }


    private List<CollegeResult> filterAndSearch(
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
                            null,
                            rawTable.getDistrict(), rawTable.getTier(),
                            rawTable.getHighestPackage(), rawTable.getAveragePackage(),
                            rawTable.getPlacementDriveQuality(),
                            displayCategory
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

        final List<RawTable> branchFilteredRawTables = rawTables.stream()
                .filter(c -> filters.effectiveBranches.contains(c.getBranchCode()))
                .collect(Collectors.toList());

        List<CollegeResult> predictableResults = filters.effectiveBranches.stream()
                .flatMap(currentBranch -> filters.effectiveCategories.stream()
                        .flatMap(currentCategory -> {

                            return branchFilteredRawTables.stream()
                                    .filter(rawTable -> rawTable.getBranchCode().equals(currentBranch))
                                    .map(rawTable -> {

                                        Integer cutoff = getCutoffForCategory(rawTable, currentCategory);
                                        Double probability = null;

                                        final int minimumCutoffRank = rank - MINIMUM_CUTOFF_BUFFER;

                                        if (cutoff != null && cutoff >= minimumCutoffRank) {

                                            if (rank <= cutoff) {
                                                probability = 85.0 + 10.0 * (cutoff - rank) / (cutoff + 1.0);
                                            } else {
                                                int diff = rank - cutoff;
                                                probability = 50.0 - (42.0 * ((double)diff / EFFECTIVE_MAX_DIFF));
                                                probability = Math.max(5.0, probability);
                                            }

                                            probability = Math.max(5.0, Math.min(95.0, probability));

                                        }

                                        CollegeResult result = new CollegeResult(
                                                rawTable.getInstitution_name(), rawTable.getRegion(), rawTable.getPlace(),
                                                rawTable.getAffl(), rawTable.getBranchCode(), cutoff, rawTable.getInstcode(),
                                                probability, rawTable.getDistrict(), rawTable.getTier(),
                                                rawTable.getHighestPackage(), rawTable.getAveragePackage(),
                                                rawTable.getPlacementDriveQuality(),
                                                currentCategory
                                        );

                                        return result;
                                    });
                        })
                )
                .filter(result -> result.getProbability() != null)
                .filter(result -> {
                    boolean passesQualityFilter = filters.userQualities.isEmpty() || filters.userQualities.contains(result.getPlacementDriveQuality());
                    return passesQualityFilter;
                })
                .collect(Collectors.toList());

        if (!predictableResults.isEmpty()) {
            predictableResults.sort(Comparator
                    .comparingInt((CollegeResult cr) -> cr.getCutoff() != null ? Math.abs(cr.getCutoff() - rank) : Integer.MAX_VALUE)

                    .thenComparing(CollegeResult::getProbability, Comparator.reverseOrder())

                    .thenComparing((CollegeResult cr) -> TIER_SORT_MAP.getOrDefault(cr.getTier(), 99))

                    .thenComparing(CollegeResult::getCutoff, Comparator.nullsLast(Comparator.reverseOrder()))
            );
        }

        return predictableResults.stream().limit(REQUIRED_TOTAL_COUNT).collect(Collectors.toList());
    }

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

    private Double calculateMedianCutoff(List<RawTable> rawTables, String category) {
        List<Integer> cutoffs = rawTables.stream()
                .map(c -> getCutoffForCategory(c, category))
                .filter(Objects::nonNull)
                .sorted()
                .collect(Collectors.toList());

        int count = cutoffs.size();

        if (count == 0) return null;

        if (count % 2 == 1) return (double) cutoffs.get(count / 2);
        return (cutoffs.get(count / 2 - 1) + cutoffs.get(count / 2)) / 2.0;
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