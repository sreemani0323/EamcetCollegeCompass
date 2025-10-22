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
        
        Function<String, String> extractAndNormalize = key ->
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

        // Extract filters
        String branch = extractAndNormalize.apply("branch");
        String category = extractAndNormalize.apply("category");
        String district = extractAndNormalize.apply("district");
        String region = extractAndNormalize.apply("region");
        String tier = extractAndNormalize.apply("tier");
        String gender = extractAndNormalize.apply("gender");
        String placementQualityFilter = extractAndNormalize.apply("placementQualityFilter");

        boolean hasFilters = branch != null || category != null || district != null || 
                            region != null || tier != null || placementQualityFilter != null || gender != null;

        log.info("Request parameters: rank={}, branch={}, category={}, district={}, region={}, tier={}, gender={}, placementQuality={}, hasFilters={}",
                rank, branch, category, district, region, tier, gender, placementQualityFilter, hasFilters);

        // If payload is empty (no rank and no filters), return all college data
        if (rank == null && !hasFilters) {
            log.info("No filters provided, returning all colleges");
            List<CollegeDataDto> allColleges = repo.findAll()
                    .stream()
                    .map(CollegeDataDto::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(allColleges);
        }

        // Perform prediction/filtering with all parameters
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

        log.info("Returning {} college results", results.size());
        return ResponseEntity.ok(results);
    }
}