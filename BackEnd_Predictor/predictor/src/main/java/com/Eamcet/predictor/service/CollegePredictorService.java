package com.Eamcet.predictor.service;

import com.Eamcet.predictor.dto.CollegeDataDto;
import com.Eamcet.predictor.model.College;
import com.Eamcet.predictor.repository.CollegeRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.Getter;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CollegePredictorService {

    private final CollegeRepository repo;

    public CollegePredictorService(CollegeRepository repo) {
        this.repo = repo;
    }

    // This is the DTO that will be returned to the controller
    @Getter
    public static class CollegeResult {
        private final String name;
        private final String branch;
        private final Integer cutoff;
        private final String district;
        private final String category; // The specific category that matched (e.g., oc_boys)
        // Add other fields you want to show in the result

        public CollegeResult(College college, Integer cutoff, String category) {
            this.name = college.getInstitution_name();
            this.branch = college.getBranchCode();
            this.cutoff = cutoff;
            this.district = college.getDistrict();
            this.category = category;
        }
    }

    public List<CollegeResult> findColleges(
            Integer rank, String branch, String category, String district, String region, String tier,
            String placementQuality, String gender) {

        // Build the database query specification
        Specification<College> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (district != null) {
                predicates.add(criteriaBuilder.equal(root.get("district"), district));
            }
            if (region != null) {
                predicates.add(criteriaBuilder.equal(root.get("region"), region));
            }
            // Add other filters for tier, etc. if needed

            // ### FIX FOR GENDER FILTERING ISSUE ###
            // If the gender is "boys", we add a condition to the database query
            // to exclude colleges where the 'division' column is 'W'.
            if ("boys".equalsIgnoreCase(gender)) {
                predicates.add(criteriaBuilder.notEqual(root.get("division"), "W"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // 1. Fetch colleges from the database based on the specification
        List<College> colleges = repo.findAll(spec);

        // 2. Prepare the list of categories to check based on user input
        Set<String> categoriesToCheck = getEffectiveCategories(category, gender);

        // 3. Process the results in Java to find the correct cutoff
        return colleges.stream()
                // Filter by branch in memory if a branch is specified
                .filter(college -> branch == null || branch.equals(college.getBranchCode()))
                // Use flatMap to check each college against each possible category
                .flatMap(college -> categoriesToCheck.stream().map(cat -> {
                    // ### FIX FOR CUTOFF NULL ISSUE ###
                    // This logic now correctly checks every relevant category for a cutoff
                    Integer cutoff = getCutoffForCategory(college, cat);
                    if (cutoff != null && cutoff > 0) {
                        // If a valid cutoff is found, create a result object
                        return new CollegeResult(college, cutoff, cat);
                    }
                    return null; // Return null if no cutoff was found for this combination
                }))
                .filter(Objects::nonNull) // Remove all the nulls
                .sorted(Comparator.comparing(CollegeResult::getCutoff)) // Sort by the cutoff rank
                .collect(Collectors.toList());
    }

    // Helper method to determine which category strings to check (e.g., "oc_boys")
    private Set<String> getEffectiveCategories(String category, String gender) {
        Set<String> effectiveCategories = new HashSet<>();

        List<String> gendersToCheck = new ArrayList<>();
        if (gender != null) {
            gendersToCheck.add(gender.toLowerCase());
        } else {
            gendersToCheck.add("boys");
            gendersToCheck.add("girls");
        }

        List<String> categoriesToCheck = new ArrayList<>();
        if (category != null) {
            categoriesToCheck.add(category.toLowerCase());
        } else {
            // If no category is given, we check all of them
            categoriesToCheck.addAll(Set.of("oc", "sc", "st", "bca", "bcb", "bcc", "bcd", "bce", "oc_ews"));
        }

        for (String cat : categoriesToCheck) {
            for (String gen : gendersToCheck) {
                effectiveCategories.add(cat + "_" + gen);
            }
        }
        return effectiveCategories;
    }

    // This helper method maps the category string to the correct getter in your College entity
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
    public List<CollegeDataDto> getAllColleges() {
        return repo.findAll()
                .stream()
                .map(CollegeDataDto::new)
                .collect(Collectors.toList());
    }
}