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

    @Getter
    public static class CollegeResult {
        private final String instcode;
        private final String name;
        private final String branch;
        private final Integer cutoff;
        private final String district;
        private final String region;
        private final String tier;
        private final String division;
        private final String category;
        private final Double averagePackage;
        private final Double highestPackage;
        private final String placementDriveQuality;
        private final String place;
        private final String affiliation;
        
        private final Double probability;

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
            Integer rank, List<String> branches, String category, List<String> districts, 
            List<String> regions, List<String> tiers, List<String> placementQualities, String gender) {

        Specification<College> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (branches != null && !branches.isEmpty()) {
                predicates.add(root.get("branchCode").in(branches));
            }
            
            if (districts != null && !districts.isEmpty()) {
                predicates.add(root.get("district").in(districts));
            }
            
            if (regions != null && !regions.isEmpty()) {
                predicates.add(root.get("region").in(regions));
            }
            
            if (tiers != null && !tiers.isEmpty()) {
                predicates.add(root.get("tier").in(tiers));
            }
            
            if (placementQualities != null && !placementQualities.isEmpty()) {
                predicates.add(root.get("placementDriveQuality").in(placementQualities));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        List<College> colleges = repo.findAll(spec);

        Set<String> categoriesToCheck = getEffectiveCategories(category, gender);

        List<CollegeResult> results = colleges.stream()
                .flatMap(college -> categoriesToCheck.stream()
                        .map(cat -> {
                            Integer cutoff = getCutoffForCategory(college, cat);
                            
                            if (cutoff == null || cutoff == 0) {
                                return null;
                            }

                            Double probability = null;

                            if (rank != null && rank > 0) {
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
                                    return null;
                                }
                            }

                            return new CollegeResult(college, cutoff, cat, probability);
                        })
                        .filter(Objects::nonNull)
                )
                .sorted((a, b) -> {
                    if (rank != null && rank > 0) {
                        Integer cutoffA = a.getCutoff();
                        Integer cutoffB = b.getCutoff();
                        
                        if (cutoffA == null && cutoffB == null) return 0;
                        if (cutoffA == null) return 1;
                        if (cutoffB == null) return -1;
                        
                        int distanceA = Math.abs(cutoffA - rank);
                        int distanceB = Math.abs(cutoffB - rank);
                        
                        int distanceComparison = Integer.compare(distanceA, distanceB);
                        if (distanceComparison != 0) {
                            return distanceComparison;
                        }
                        
                        Double probA = a.getProbability();
                        Double probB = b.getProbability();
                        if (probA != null && probB != null) {
                            return Double.compare(probB, probA);
                        }
                        if (probA != null) return -1;
                        if (probB != null) return 1;
                        return 0;
                    } else {
                        Integer cutoffA = a.getCutoff();
                        Integer cutoffB = b.getCutoff();
                        
                        if (cutoffA == null && cutoffB == null) return 0;
                        if (cutoffA == null) return 1;
                        if (cutoffB == null) return -1;
                        
                        return Integer.compare(cutoffB, cutoffA);
                    }
                })
                .limit(100)
                .collect(Collectors.toList());

        return results;
    }
    
    private Set<String> getEffectiveCategories(String category, String gender) {
        Set<String> effectiveCategories = new HashSet<>();

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

        for (String cat : categoriesToCheck) {
            for (String gen : gendersToCheck) {
                effectiveCategories.add(cat + "_" + gen);
            }
        }

        return effectiveCategories;
    }

    public Integer getCutoffForCategory(College c, String category) {
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
        
        if (cutoff != null && cutoff > 0) {
            return cutoff;
        }
        
        return null;
    }
    
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
    
    public Double getTierScore(String tier) {
        if (tier == null) return 0.5;
        return switch (tier) {
            case "Tier 1" -> 1.0;
            case "Tier 2" -> 0.7;
            case "Tier 3" -> 0.4;
            default -> 0.5;
        };
    }
    
    public String getRecommendationType(Double probability) {
        if (probability == null) return "EXPLORE";
        if (probability >= 85) return "SAFE";
        if (probability >= 40) return "MODERATE";
        return "REACH";
    }
}