package com.Eamcet.predictor.controller;

import com.Eamcet.predictor.dto.CollegeDataDto;
import com.Eamcet.predictor.exception.InvalidRequestException;
import com.Eamcet.predictor.repository.CollegeRepository;
import com.Eamcet.predictor.service.CollegePredictorService;
import com.Eamcet.predictor.service.CollegePredictorService.CollegeResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://sreemani0323.github.io")
public class CollegePredictorController {

    private static final Logger log = LoggerFactory.getLogger(CollegePredictorController.class);
    private final CollegePredictorService service;
    private final CollegeRepository repo;

    public CollegePredictorController(CollegePredictorService service, CollegeRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    /**
     * Endpoint to predict or filter colleges based on user criteria.
     * Returns all college data if payload is empty (for analytics/map features).
     * Returns filtered/predicted results based on criteria provided.
     * 
     * @param payload A map containing rank and filter options.
     * @return List of predicted/filtered colleges or all colleges if no criteria
     */
    @PostMapping("/predict-colleges")
    public ResponseEntity<?> predict(@RequestBody Map<String, Object> payload) {
        log.debug("Received predict request with payload: {}", payload);
        
        // Helper function to extract and parse comma-separated values into a List
        Function<String, List<String>> extractAndSplit = key ->
                Optional.ofNullable(payload.get(key))
                        .filter(obj -> obj instanceof String)
                        .map(String.class::cast)
                        .filter(s -> !s.trim().isEmpty())
                        .map(s -> Arrays.stream(s.split(","))
                                .map(String::trim)
                                .filter(val -> !val.isEmpty())
                                .collect(Collectors.toList()))
                        .filter(list -> !list.isEmpty())
                        .orElse(null);
        
        // Helper function for single-value extraction
        Function<String, String> extractSingle = key ->
                Optional.ofNullable(payload.get(key))
                        .filter(obj -> obj instanceof String)
                        .map(String.class::cast)
                        .filter(s -> !s.trim().isEmpty())
                        .orElse(null);

        // Extract and validate rank
        Integer rank = null;
        Object rankObj = payload.get("rank");
        if (rankObj instanceof Number) {
            int inputRank = ((Number) rankObj).intValue();
            if (inputRank > 0) {
                rank = inputRank;
            } else if (inputRank < 0) {
                throw new InvalidRequestException("Rank must be a positive number");
            }
        }

        // Extract multi-select filters (comma-separated values from frontend)
        List<String> branches = extractAndSplit.apply("branch");
        List<String> districts = extractAndSplit.apply("district");
        List<String> regions = extractAndSplit.apply("region");
        List<String> tiers = extractAndSplit.apply("tier");
        List<String> placementQualities = extractAndSplit.apply("placementQualityFilter");
        
        // Extract single-select filters (category and gender are single-select)
        String category = extractSingle.apply("category");
        String gender = extractSingle.apply("gender");

        boolean hasFilters = branches != null || category != null || districts != null || 
                            regions != null || tiers != null || placementQualities != null || gender != null;

        log.info("Request parameters: rank={}, branches={}, category={}, districts={}, regions={}, tiers={}, gender={}, placementQualities={}, hasFilters={}",
                rank, branches, category, districts, regions, tiers, gender, placementQualities, hasFilters);

        // If payload is empty (no rank and no filters), return all college data
        if (rank == null && !hasFilters) {
            log.info("No filters provided, returning all colleges");
            try {
                List<CollegeDataDto> allColleges = repo.findAll()
                        .stream()
                        .map(CollegeDataDto::new)
                        .collect(Collectors.toList());
                log.info("Successfully retrieved {} colleges", allColleges.size());
                return ResponseEntity.ok(allColleges);
            } catch (Exception e) {
                log.error("Error fetching all colleges from database", e);
                throw new RuntimeException("Failed to fetch colleges from database: " + e.getMessage(), e);
            }
        }

        // Perform prediction/filtering with all parameters
        List<CollegeResult> results = service.findColleges(
                rank,
                branches,
                category,
                districts,
                regions,
                tiers,
                placementQualities,
                gender
        );

        log.info("Returning {} college results", results.size());
        return ResponseEntity.ok(results);
    }
}