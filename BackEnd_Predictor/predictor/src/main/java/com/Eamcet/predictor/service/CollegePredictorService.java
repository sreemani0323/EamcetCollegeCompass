package com.Eamcet.predictor.service;

import com.Eamcet.predictor.dto.CollegeDataDto;
import com.Eamcet.predictor.model.College;
import com.Eamcet.predictor.repository.CollegeRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CollegePredictorService {

    private static final Logger log = LoggerFactory.getLogger(CollegePredictorService.class);
    private final CollegeRepository repo;

    public CollegePredictorService(CollegeRepository repo) {
        this.repo = repo;
    }

    // Enhanced DTO with all relevant fields including probability prediction
    @Getter
    public static class CollegeResult {
        private final String instcode;
        private final String name;
        private final String branch;
        private final Integer cutoff;
        private final String district;
        private final String region;
        private final String tier;
        private final String division; // Gender info (M/W/Co-ed)
        private final String category; // The specific category that matched (e.g., oc_boys)
        private final Double averagePackage;
        private final Double highestPackage;
        private final String placementDriveQuality;
        private final String place;
        private final String affiliation;
        
        // Prediction field
        private final Double probability; // Admission probability percentage

        public CollegeResult(College college, Integer cutoff, String category, Double probability) {
            this.instcode = college.getInstcode();
            this.name = college.getInstitution_name();
            this.branch = college.getBranchCode();
            this.cutoff = cutoff;
            this.district = college.getDistrict();
            this.region = college.getRegion();
            this.tier = college.getTier();
            this.division = college.getDivision();
            this.category = category;
            this.averagePackage = college.getAveragePackage();
            this.highestPackage = college.getHighestPackage();
            this.placementDriveQuality = college.getPlacementDriveQuality();
            this.place = college.getPlace();
            this.affiliation = college.getAffl();
            this.probability = probability;
        }
    }

    public List<CollegeResult> findColleges(
            Integer rank, String branch, String category, String district, String region, String tier,
            String placementQuality, String gender) {

        log.debug("Finding colleges with: rank={}, branch={}, category={}, district={}, region={}, tier={}, placementQuality={}, gender={}",
                rank, branch, category, district, region, tier, placementQuality, gender);

        // Build the database query specification with ALL filters
        // NOTE: Division field is for college type (Private/University/etc), NOT gender
        // Gender filtering happens by checking which cutoff columns have non-null values
        Specification<College> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Filter by branch at database level for better performance
            if (branch != null && !branch.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("branchCode"), branch));
            }
            
            if (district != null && !district.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("district"), district));
            }
            
            if (region != null && !region.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("region"), region));
            }
            
            // Add tier filter
            if (tier != null && !tier.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("tier"), tier));
            }
            
            // Add placement quality filter
            if (placementQuality != null && !placementQuality.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("placementDriveQuality"), placementQuality));
            }

            // NO gender-based database filtering needed
            // Women's colleges naturally have NULL in boys columns
            // Men's colleges naturally have NULL in girls columns
            // Filtering happens by checking non-null cutoff values

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // Fetch colleges from the database based on the specification
        List<College> colleges = repo.findAll(spec);
        log.debug("Fetched {} colleges from database", colleges.size());

        // Determine which category-gender combinations to check
        Set<String> categoriesToCheck = getEffectiveCategories(category, gender);
        log.debug("Categories to check: {}", categoriesToCheck);

        // Process the results to find matching cutoffs with probability calculation
        // CRITICAL: Only include results where cutoff is NOT NULL
        // This automatically filters out:
        // - Women's colleges when checking *_boys columns (they have NULL)
        // - Men's colleges when checking *_girls columns (they have NULL)
        List<CollegeResult> results = colleges.stream()
                .flatMap(college -> categoriesToCheck.stream()
                        .map(cat -> {
                            Integer cutoff = getCutoffForCategory(college, cat);
                            
                            // CRITICAL: Only process if cutoff exists and is valid
                            // This is how we filter women's/men's colleges!
                            // Women's colleges have NULL in boys columns
                            // Men's colleges have NULL in girls columns
                            if (cutoff == null || cutoff == 0) {
                                return null;
                            }

                            // Calculate probability only if rank is provided
                            Double probability = null;

                            if (rank != null && rank > 0) {
                                // Probability calculation based on rank vs cutoff
                                double assuredBoundary = cutoff * 0.95;
                                double reachableBoundary = cutoff * 1.10;
                                double ambitiousBoundary = cutoff * 1.25;

                                if (rank <= assuredBoundary) {
                                    double score = ((double) cutoff - rank) / cutoff;
                                    probability = 85.0 + 14.0 * score;
                                    probability = Math.min(99.0, probability);

                                } else if (rank <= reachableBoundary) {
                                    double range = reachableBoundary - assuredBoundary;
                                    double score = (reachableBoundary - rank) / range;
                                    probability = 40.0 + 45.0 * score;

                                } else if (rank <= ambitiousBoundary) {
                                    double range = ambitiousBoundary - reachableBoundary;
                                    double score = (ambitiousBoundary - rank) / range;
                                    probability = 5.0 + 35.0 * score;

                                } else {
                                    // Rank is too low for this college
                                    return null;
                                }
                            }
                            // When rank is null, probability remains null (frontend will show "N/A")

                            return new CollegeResult(college, cutoff, cat, probability);
                        })
                        .filter(Objects::nonNull)
                )
                .sorted((a, b) -> {
                    // If rank is provided, sort by distance from user's rank (nearest first)
                    if (rank != null && rank > 0) {
                        Integer cutoffA = a.getCutoff();
                        Integer cutoffB = b.getCutoff();
                        
                        // Handle null cutoffs (shouldn't happen due to earlier filtering, but safety check)
                        if (cutoffA == null && cutoffB == null) return 0;
                        if (cutoffA == null) return 1;
                        if (cutoffB == null) return -1;
                        
                        // Calculate absolute distance from user's rank
                        int distanceA = Math.abs(cutoffA - rank);
                        int distanceB = Math.abs(cutoffB - rank);
                        
                        // Sort by nearest distance first
                        int distanceComparison = Integer.compare(distanceA, distanceB);
                        if (distanceComparison != 0) {
                            return distanceComparison;
                        }
                        
                        // If distances are equal, prioritize by probability (higher first)
                        Double probA = a.getProbability();
                        Double probB = b.getProbability();
                        if (probA != null && probB != null) {
                            return Double.compare(probB, probA); // Descending
                        }
                        if (probA != null) return -1;
                        if (probB != null) return 1;
                        return 0;
                    } else {
                        // When no rank provided, sort by cutoff descending (most competitive first)
                        Integer cutoffA = a.getCutoff();
                        Integer cutoffB = b.getCutoff();
                        
                        if (cutoffA == null && cutoffB == null) return 0;
                        if (cutoffA == null) return 1;
                        if (cutoffB == null) return -1;
                        
                        return Integer.compare(cutoffB, cutoffA); // Descending
                    }
                })
                .limit(100) // Limit results to top 100 colleges
                .collect(Collectors.toList());

        log.debug("Returning {} college results (limited to 100)", results.size());
        return results;
    }
    private Set<String> getEffectiveCategories(String category, String gender) {
        Set<String> effectiveCategories = new HashSet<>();

        // Determine which genders to check
        List<String> gendersToCheck = new ArrayList<>();
        if (gender != null && !gender.trim().isEmpty()) {
            String genderLower = gender.toLowerCase();
            if ("boys".equals(genderLower) || "male".equals(genderLower)) {
                gendersToCheck.add("boys");
            } else if ("girls".equals(genderLower) || "female".equals(genderLower)) {
                gendersToCheck.add("girls");
            } else {
                // Invalid gender, default to both
                gendersToCheck.add("boys");
                gendersToCheck.add("girls");
            }
        } else {
            // CORRECTED: When gender is null, check BOTH boys AND girls columns
            // User hasn't specified gender preference, so show all options
            gendersToCheck.add("boys");
            gendersToCheck.add("girls");
        }

        // Determine which categories to check
        List<String> categoriesToCheck = new ArrayList<>();
        if (category != null && !category.trim().isEmpty()) {
            categoriesToCheck.add(category.toLowerCase());
        } else {
            // If no category specified, check all categories
            categoriesToCheck.addAll(Arrays.asList("oc", "sc", "st", "bca", "bcb", "bcc", "bcd", "bce", "oc_ews"));
        }

        // Build the category_gender combinations (e.g., "oc_boys", "sc_girls")
        for (String cat : categoriesToCheck) {
            for (String gen : gendersToCheck) {
                effectiveCategories.add(cat + "_" + gen);
            }
        }

        log.debug("Effective categories for category='{}' and gender='{}': {}", category, gender, effectiveCategories);
        return effectiveCategories;
    }

    /**
     * Maps category string to the correct College entity getter
     * Returns null if category doesn't match or if the cutoff value is null/0
     */
    private Integer getCutoffForCategory(College c, String category) {
        if (category == null || category.trim().isEmpty()) {
            return null;
        }
        
        Integer cutoff = switch (category.toLowerCase()) {
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
        
        // Additional validation: ensure cutoff is not null and is positive
        if (cutoff != null && cutoff > 0) {
            log.trace("College '{}' branch '{}' category '{}' has cutoff: {}", 
                    c.getInstitution_name(), c.getBranchCode(), category, cutoff);
            return cutoff;
        }
        
        return null;
    }
}