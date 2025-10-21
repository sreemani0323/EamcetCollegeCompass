package com.Eamcet.predictor.controller;

import com.Eamcet.predictor.dto.CollegeDataDto;
import com.Eamcet.predictor.exception.InvalidRequestException;
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

    /**
     * Endpoint to get a list of all colleges for analytics and map features.
     * NOTE: This GET endpoint is now effectively bypassed by the frontend due to routing logic.
     * @return A list of all colleges.
     */
    @GetMapping("/colleges")
    public ResponseEntity<List<CollegeDataDto>> getAllColleges() {
        List<CollegeDataDto> allColleges = service.getAllColleges();
        return ResponseEntity.ok(allColleges);
    }

    /**
     * Endpoint to predict or filter colleges based on user criteria.
     * MODIFICATION: This endpoint now also returns ALL data (List<CollegeDataDto>)
     * if the request payload contains neither a rank nor any filters (i.e., payload is empty),
     * enabling the Data Insights and Map pages to fetch data via this reliable POST route.
     * @param payload A map containing rank and filter options.
     * @return A list of predicted, filtered (List<CollegeResult>), or all colleges (List<CollegeDataDto>).
     */
    @PostMapping("/predict-colleges")
    public ResponseEntity<?> predict(@RequestBody Map<String, Object> payload) {
        Function<String, String> extractAndNormalize = key ->
                Optional.ofNullable(payload.get(key))
                        .filter(obj -> obj instanceof String)
                        .map(String.class::cast)
                        .filter(s -> !s.trim().isEmpty())
                        .orElse(null);

        Integer rank = null;
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
        String gender = extractAndNormalize.apply("gender");
        String placementQualityFilter = extractAndNormalize.apply("placementQualityFilter");

        boolean hasFilters = branch != null || category != null || district != null || region != null || tier != null || placementQualityFilter != null || gender != null;

        // *** FIX FOR FRONTEND ROUTING ISSUE ***
        // If the payload is essentially empty (no rank and no filters), return all college data.
        if (rank == null && !hasFilters) {
            List<CollegeDataDto> allColleges = service.getAllColleges();
            return ResponseEntity.ok(allColleges); // Returns List<CollegeDataDto>
        }

        // Existing Logic: Handles prediction and filtering.
        List<CollegeResult> results = service.findColleges(
                rank,
                branch,
                category,
                district,
                region,
                tier,
                placementQualityFilter,
                gender
        );

        return ResponseEntity.ok(results);
    }
}
