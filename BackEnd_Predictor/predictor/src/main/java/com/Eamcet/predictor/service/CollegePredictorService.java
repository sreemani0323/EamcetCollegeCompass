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

/**
 * Service class for the College Predictor application.
 * Contains business logic for finding colleges, calculating probabilities,
 * and handling category/gender combinations.
 * 
 * This service is responsible for:
 * 1. Filtering colleges based on various criteria
 * 2. Calculating admission probabilities based on rank and cutoff data
 * 3. Handling category and gender combinations
 * 4. Providing utility methods for quality and tier scoring
 */
@Service
public class CollegePredictorService {

    private static final Logger log = LoggerFactory.getLogger(CollegePredictorService.class);
    private final CollegeRepository repo;

    /**
     * Constructor for dependency injection of the college repository.
     * 
     * @param repo The college repository for database operations
     */
    public CollegePredictorService(CollegeRepository repo) {
        this.repo = repo;
    }

    /**
     * Data Transfer Object representing a college result with prediction information.
     * Contains college details along with cutoff rank, category, and admission probability.
     */
    @Getter
    public static class CollegeResult {
        /**
         * Institution code of the college.
         */
        private final String instcode;
        
        /**
         * Name of the college/institution.
         */
        private final String name;
        
        /**
         * Branch code (e.g., CSE, ECE).
         */
        private final String branch;
        
        /**
         * Cutoff rank for the specific category.
         */
        private final Integer cutoff;
        
        /**
         * District where the college is located.
         */
        private final String district;
        
        /**
         * Region where the college is located.
         */
        private final String region;
        
        /**
         * Tier classification of the college.
         */
        private final String tier;
        
        /**
         * Division information.
         */
        private final String division;
        
        /**
         * Category for which the cutoff applies.
         */
        private final String category;
        
        /**
         * Average package offered during placements.
         */
        private final Double averagePackage;
        
        /**
         * Highest package offered during placements.
         */
        private final Double highestPackage;
        
        /**
         * Quality rating of placement drive.
         */
        private final String placementDriveQuality;
        
        /**
         * Place/locality of the college.
         */
        private final String place;
        
        /**
         * Affiliation information.
         */
        private final String affiliation;
        
        /**
         * Calculated probability of admission based on rank and cutoff.
         */
        private final Double probability;

        /**
         * Constructor for CollegeResult DTO.
         * 
         * @param college The college entity containing basic information
         * @param cutoff The cutoff rank for the specific category
         * @param category The category for which the cutoff applies
         * @param probability The calculated admission probability
         */
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

    /**
     * Finds colleges based on rank and various filter criteria.
     * This is the core method for college predictions.
     * 
     * @param rank The EAMCET rank of the student (can be null)
     * @param branches List of preferred branches (can be null)
     * @param category The reservation category (can be null)
     * @param districts List of preferred districts (can be null)
     * @param regions List of preferred regions (can be null)
     * @param tiers List of preferred college tiers (can be null)
     * @param placementQualities List of preferred placement qualities (can be null)
     * @param gender The gender of the student (can be null)
     * @return List of CollegeResult objects matching the criteria
     */
    public List<CollegeResult> findColleges(
            Integer rank, List<String> branches, String category, List<String> districts, 
            List<String> regions, List<String> tiers, List<String> placementQualities, String gender) {

        // Build specification for dynamic filtering based on provided criteria
        Specification<College> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Add branch filter if provided
            if (branches != null && !branches.isEmpty()) {
                predicates.add(root.get("branchCode").in(branches));
            }
            
            // Add district filter if provided
            if (districts != null && !districts.isEmpty()) {
                predicates.add(root.get("district").in(districts));
            }
            
            // Add region filter if provided
            if (regions != null && !regions.isEmpty()) {
                predicates.add(root.get("region").in(regions));
            }
            
            // Add tier filter if provided
            if (tiers != null && !tiers.isEmpty()) {
                predicates.add(root.get("tier").in(tiers));
            }
            
            // Add placement quality filter if provided
            if (placementQualities != null && !placementQualities.isEmpty()) {
                predicates.add(root.get("placementDriveQuality").in(placementQualities));
            }

            // If no predicates, return null to avoid unnecessary filtering
            if (predicates.isEmpty()) {
                return null;
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // Find colleges matching the filter criteria
        List<College> colleges = repo.findAll(spec);
        log.debug("Found {} colleges after applying filters", colleges.size());

        // Determine effective categories to check based on provided category and gender
        Set<String> categoriesToCheck = getEffectiveCategories(category, gender);
        log.debug("Effective categories to check: {}", categoriesToCheck);

        // Process each college for each category and calculate probabilities
        List<CollegeResult> results = colleges.stream()
                .flatMap(college -> categoriesToCheck.stream()
                        .map(cat -> {
                            // Get cutoff for the specific category
                            Integer cutoff = getCutoffForCategory(college, cat);
                            log.debug("College: {}, Category: {}, Cutoff: {}", college.getInstcode(), cat, cutoff);
                            
                            // Allow colleges with null cutoffs to pass through when no rank is provided
                            if (cutoff == null || cutoff == 0) {
                                if (rank != null) {
                                    return null; // Only filter out null cutoffs when rank is provided
                                }
                                // When no rank is provided, include colleges even with null cutoffs
                                return new CollegeResult(college, cutoff, cat, null);
                            }

                            // Calculate admission probability based on rank and cutoff
                            Double probability = null;

                            if (rank != null && rank > 0) {
                                // Define probability boundaries based on cutoff
                                double assuredBoundary = cutoff * 0.95;      // 95% chance of admission
                                double reachableBoundary = cutoff * 1.10;    // 40% chance of admission
                                double ambitiousBoundary = cutoff * 1.25;    // 5% chance of admission

                                if (rank <= assuredBoundary) {
                                    // High probability (85-99%)
                                    double score = ((double) cutoff - rank) / cutoff;
                                    probability = 85.0 + 14.0 * score;
                                    probability = Math.min(99.0, probability);

                                } else if (rank <= reachableBoundary) {
                                    // Moderate probability (40-85%)
                                    double range = reachableBoundary - assuredBoundary;
                                    double score = (reachableBoundary - rank) / range;
                                    probability = 40.0 + 45.0 * score;

                                } else if (rank <= ambitiousBoundary) {
                                    // Low probability (5-40%)
                                    double range = ambitiousBoundary - reachableBoundary;
                                    double score = (ambitiousBoundary - rank) / range;
                                    probability = 5.0 + 35.0 * score;

                                } else {
                                    // Very low probability, exclude from results
                                    return null;
                                }
                            }

                            // Create and return CollegeResult with calculated probability
                            return new CollegeResult(college, cutoff, cat, probability);
                        })
                        .filter(Objects::nonNull)
                )
                .sorted((a, b) -> {
                    // Sort results based on rank and probability
                    if (rank != null && rank > 0) {
                        Integer cutoffA = a.getCutoff();
                        Integer cutoffB = b.getCutoff();
                        
                        // Handle null cutoffs
                        if (cutoffA == null && cutoffB == null) return 0;
                        if (cutoffA == null) return 1;
                        if (cutoffB == null) return -1;
                        
                        // Sort by distance from rank (closer is better)
                        int distanceA = Math.abs(cutoffA - rank);
                        int distanceB = Math.abs(cutoffB - rank);
                        
                        int distanceComparison = Integer.compare(distanceA, distanceB);
                        if (distanceComparison != 0) {
                            return distanceComparison;
                        }
                        
                        // If distances are equal, sort by probability (higher is better)
                        Double probA = a.getProbability();
                        Double probB = b.getProbability();
                        if (probA != null && probB != null) {
                            return Double.compare(probB, probA);
                        }
                        if (probA != null) return -1;
                        if (probB != null) return 1;
                        return 0;
                    } else {
                        // When no rank is provided, sort by cutoff (higher is better)
                        Integer cutoffA = a.getCutoff();
                        Integer cutoffB = b.getCutoff();
                        
                        if (cutoffA == null && cutoffB == null) return 0;
                        if (cutoffA == null) return 1;
                        if (cutoffB == null) return -1;
                        
                        return Integer.compare(cutoffB, cutoffA);
                    }
                })
                .limit(100) // Limit results to 100 for performance
                .collect(Collectors.toList());
        
        log.debug("Returning {} college results after all processing", results.size());
        return results;
    }
    
    /**
     * Determines the effective categories to check based on provided category and gender.
     * Handles various combinations and defaults to comprehensive checking when parameters are missing.
     * 
     * @param category The reservation category (can be null)
     * @param gender The gender (can be null)
     * @return Set of effective category strings in format "category_gender"
     */
    public Set<String> getEffectiveCategories(String category, String gender) {
        Set<String> effectiveCategories = new HashSet<>();

        // If both category and gender are explicitly provided, use only that specific combination
        if (category != null && !category.trim().isEmpty() && 
            gender != null && !gender.trim().isEmpty()) {
            String categoryLower = category.toLowerCase();
            String genderLower = gender.toLowerCase();
            
            // Normalize gender values
            String normalizedGender;
            if ("boys".equals(genderLower) || "male".equals(genderLower)) {
                normalizedGender = "boys";
            } else if ("girls".equals(genderLower) || "female".equals(genderLower)) {
                normalizedGender = "girls";
            } else {
                normalizedGender = genderLower; // fallback to the original value
            }
            
            effectiveCategories.add(categoryLower + "_" + normalizedGender);
            return effectiveCategories;
        }

        // Original logic for when one or both parameters are missing
        List<String> gendersToCheck = new ArrayList<>();
        if (gender != null && !gender.trim().isEmpty()) {
            String genderLower = gender.toLowerCase();
            if ("boys".equals(genderLower) || "male".equals(genderLower)) {
                gendersToCheck.add("boys");
            } else if ("girls".equals(genderLower) || "female".equals(genderLower)) {
                gendersToCheck.add("girls");
            } else {
                gendersToCheck.add("boys");
                gendersToCheck.add("girls");
            }
        } else {
            gendersToCheck.add("boys");
            gendersToCheck.add("girls");
        }

        List<String> categoriesToCheck = new ArrayList<>();
        if (category != null && !category.trim().isEmpty()) {
            categoriesToCheck.add(category.toLowerCase());
        } else {
            categoriesToCheck.addAll(Arrays.asList("oc", "sc", "st", "bca", "bcb", "bcc", "bcd", "bce", "oc_ews"));
        }

        // Create all combinations of categories and genders
        for (String cat : categoriesToCheck) {
            for (String gen : gendersToCheck) {
                effectiveCategories.add(cat + "_" + gen);
            }
        }

        return effectiveCategories;
    }

    /**
     * Gets the cutoff rank for a specific category from a college entity.
     * 
     * @param c The college entity
     * @param category The category string (e.g., "oc_boys", "sc_girls")
     * @return The cutoff rank for the specified category, or null if not available
     */
    public Integer getCutoffForCategory(College c, String category) {
        if (category == null || category.trim().isEmpty()) {
            return null;
        }
        
        // Use switch expression to map category to appropriate cutoff field
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
        
        // Return cutoff only if it's positive (valid)
        if (cutoff != null && cutoff > 0) {
            return cutoff;
        }
        
        return null;
    }
    
    /**
     * Gets a numeric quality score for placement drive quality.
     * Used for sorting colleges by placement quality.
     * 
     * @param quality The placement quality string (e.g., "Excellent", "Good")
     * @return Numeric score (4 for Excellent, 3 for Very Good, 2 for Good, 1 for Bad, 0 for null/unknown)
     */
    public Integer getQualityScore(String quality) {
        if (quality == null) return 0;
        return switch (quality) {
            case "Excellent" -> 4;
            case "Very Good" -> 3;
            case "Good" -> 2;
            case "Bad" -> 1;
            default -> 0;
        };
    }
    
    /**
     * Gets a numeric tier score for college tier.
     * Used for scoring colleges in recommendations.
     * 
     * @param tier The college tier (e.g., "Tier 1", "Tier 2")
     * @return Numeric score (1.0 for Tier 1, 0.7 for Tier 2, 0.4 for Tier 3, 0.5 for others/null)
     */
    public Double getTierScore(String tier) {
        if (tier == null) return 0.5;
        return switch (tier) {
            case "Tier 1" -> 1.0;
            case "Tier 2" -> 0.7;
            case "Tier 3" -> 0.4;
            default -> 0.5;
        };
    }
    
    /**
     * Determines recommendation type based on admission probability.
     * 
     * @param probability The calculated admission probability
     * @return Recommendation type ("SAFE" for ≥85%, "MODERATE" for ≥40%, "REACH" for <40%, "EXPLORE" for null)
     */
    public String getRecommendationType(Double probability) {
        if (probability == null) return "EXPLORE";
        if (probability >= 85) return "SAFE";
        if (probability >= 40) return "MODERATE";
        return "REACH";
    }
}