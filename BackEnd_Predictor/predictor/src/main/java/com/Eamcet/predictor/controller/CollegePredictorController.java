package com.Eamcet.predictor.controller;

import com.Eamcet.predictor.service.CollegePredictorService;
import com.Eamcet.predictor.service.CollegePredictorService.CollegeResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function; // Explicitly import Function

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CollegePredictorController {

    private final CollegePredictorService service;

    public CollegePredictorController(CollegePredictorService service) {
        this.service = service;
    }

    @PostMapping("/predict-colleges")
    public ResponseEntity<?> predict(@RequestBody Map<String, Object> payload) {
        // Helper function for safe string extraction and normalization
        Function<String, String> extractAndNormalize = key ->
                Optional.ofNullable(payload.get(key))
                        .filter(obj -> obj instanceof String)
                        .map(String.class::cast)
                        .filter(s -> !s.trim().isEmpty())
                        .orElse(null);

        Integer rank = null;

        try {
            // 1. Safely Extract RANK: Rank is now OPTIONAL
            Object rankObj = payload.get("rank");
            if (rankObj instanceof Number) {
                int inputRank = ((Number) rankObj).intValue();
                if (inputRank > 0) {
                    rank = inputRank;
                }
            }

            // 2. Extract OPTIONAL fields
            String branch = extractAndNormalize.apply("branch");
            String category = extractAndNormalize.apply("category"); // This is the combined Quota_Gender value
            String district = extractAndNormalize.apply("district");
            String region = extractAndNormalize.apply("region");
            String tier = extractAndNormalize.apply("tier");
            String placementQualityFilter = extractAndNormalize.apply("placementQualityFilter");

            // ⭐ SHOW MISSING DATA LOGIC REMOVED: Since the filtering is now client-side,
            // the service no longer needs this boolean flag.

            // 3. CRITICAL VALIDATION: Ensure at least rank OR a filter is present
            boolean hasFilters = branch != null || category != null || district != null || region != null || tier != null || placementQualityFilter != null;

            if (rank == null && !hasFilters) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Insufficient input. Please provide a valid Rank or select at least one filter.",
                        "details", "No valid rank or filters found in the request."
                ));
            }

            // 4. Call the unified service method with the required 7 arguments
            List<CollegeResult> results = service.findColleges(
                    rank,
                    branch,
                    category,
                    district,
                    region,
                    tier,
                    placementQualityFilter
                    // Removed 'showMissingData' argument to resolve compilation error
            );

            return ResponseEntity.ok(results);
        } catch (Exception ex) {
            String errorMessage = Optional.ofNullable(ex.getMessage()).orElse("Unknown internal server error.");
            return ResponseEntity.status(500).body(Map.of(
                    "error", "An internal error occurred while processing your request.",
                    "details", errorMessage
            ));
        }
    }
}