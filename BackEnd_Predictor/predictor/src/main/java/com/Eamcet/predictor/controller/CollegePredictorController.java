package com.Eamcet.predictor.controller;

import com.Eamcet.predictor.service.CollegePredictorService;
import com.Eamcet.predictor.service.CollegePredictorService.CollegeResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

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
        Function<String, String> extractAndNormalize = key ->
                Optional.ofNullable(payload.get(key))
                        .filter(obj -> obj instanceof String)
                        .map(String.class::cast)
                        .filter(s -> !s.trim().isEmpty())
                        .orElse(null);

        Integer rank = null;

        try {
            Object rankObj = payload.get("rank");
            if (rankObj instanceof Number) {
                int inputRank = ((Number) rankObj).intValue();
                if (inputRank > 0) {
                    rank = inputRank;
                }
            }

            String branch = extractAndNormalize.apply("branch");
            String category = extractAndNormalize.apply("category");
            String district = extractAndNormalize.apply("district");
            String region = extractAndNormalize.apply("region");
            String tier = extractAndNormalize.apply("tier");
            String placementQualityFilter = extractAndNormalize.apply("placementQualityFilter");

            boolean hasFilters = branch != null || category != null || district != null || region != null || tier != null || placementQualityFilter != null;

            if (rank == null && !hasFilters) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Insufficient input. Please provide a valid Rank or select at least one filter.",
                        "details", "No valid rank or filters found in the request."
                ));
            }

            List<CollegeResult> results = service.findColleges(
                    rank,
                    branch,
                    category,
                    district,
                    region,
                    tier,
                    placementQualityFilter
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