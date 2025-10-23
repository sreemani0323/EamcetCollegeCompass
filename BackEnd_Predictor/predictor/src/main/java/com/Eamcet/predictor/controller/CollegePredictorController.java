package com.Eamcet.predictor.controller;

import com.Eamcet.predictor.dto.*;
import com.Eamcet.predictor.exception.InvalidRequestException;
import com.Eamcet.predictor.model.College;
import com.Eamcet.predictor.repository.CollegeRepository;
import com.Eamcet.predictor.service.CollegePredictorService;
import com.Eamcet.predictor.service.CollegePredictorService.CollegeResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"https://sreemani0323.github.io", "http://localhost:5500", "http://127.0.0.1:5500", "null"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
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
    
    /**
     * Analytics endpoint - Get overall statistics
     */
    @GetMapping("/analytics/summary")
    public ResponseEntity<AnalyticsSummaryDto> getAnalyticsSummary() {
        log.info("Fetching analytics summary");
        List<College> allColleges = repo.findAll();
        
        Map<String, Long> collegesByRegion = allColleges.stream()
            .filter(c -> c.getRegion() != null)
            .collect(Collectors.groupingBy(College::getRegion, Collectors.counting()));
        
        Map<String, Long> collegesByTier = allColleges.stream()
            .filter(c -> c.getTier() != null)
            .collect(Collectors.groupingBy(College::getTier, Collectors.counting()));
        
        Map<String, Long> collegesByBranch = allColleges.stream()
            .filter(c -> c.getBranchCode() != null)
            .collect(Collectors.groupingBy(College::getBranchCode, Collectors.counting()));
        
        Double avgPackageOverall = allColleges.stream()
            .filter(c -> c.getAveragePackage() != null)
            .mapToDouble(College::getAveragePackage)
            .average()
            .orElse(0.0);
        
        Map<String, Double> avgPackageByBranch = allColleges.stream()
            .filter(c -> c.getBranchCode() != null && c.getAveragePackage() != null)
            .collect(Collectors.groupingBy(
                College::getBranchCode,
                Collectors.averagingDouble(College::getAveragePackage)
            ));
        
        AnalyticsSummaryDto summary = new AnalyticsSummaryDto(
            allColleges.size(),
            collegesByRegion,
            collegesByTier,
            collegesByBranch,
            avgPackageOverall,
            avgPackageByBranch
        );
        
        log.info("Analytics summary generated for {} colleges", allColleges.size());
        return ResponseEntity.ok(summary);
    }
    
    /**
     * Get all unique branch codes from database
     * Diagnostic endpoint to help frontend match branch names
     */
    @GetMapping("/analytics/branches")
    public ResponseEntity<List<String>> getAllBranches() {
        log.info("Fetching all unique branches");
        
        List<String> branches = repo.findAll().stream()
            .map(College::getBranchCode)
            .filter(Objects::nonNull)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
        
        log.info("Found {} unique branches", branches.size());
        return ResponseEntity.ok(branches);
    }
    
    /**
     * Get statistics for a specific branch
     */
    @GetMapping("/analytics/branch-stats/{branch}")
    public ResponseEntity<BranchStatsDto> getBranchStats(@PathVariable String branch) {
        log.info("Fetching branch stats for: {}", branch);
        
        List<College> branchColleges = repo.findAll().stream()
            .filter(c -> branch.equals(c.getBranchCode()))
            .collect(Collectors.toList());
        
        DoubleSummaryStatistics packageStats = branchColleges.stream()
            .filter(c -> c.getAveragePackage() != null)
            .mapToDouble(College::getAveragePackage)
            .summaryStatistics();
        
        BranchStatsDto stats = new BranchStatsDto(
            branch,
            branchColleges.size(),
            packageStats.getCount() > 0 ? packageStats.getAverage() : 0.0,
            packageStats.getCount() > 0 ? packageStats.getMax() : 0.0,
            packageStats.getCount() > 0 ? packageStats.getMin() : 0.0
        );
        
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Search colleges by name
     */
    @GetMapping("/search/by-name")
    public ResponseEntity<List<CollegeDataDto>> searchByName(@RequestParam String query) {
        log.info("Searching colleges by name: {}", query);
        
        List<College> colleges = repo.findAll().stream()
            .filter(c -> c.getInstitution_name() != null && 
                        c.getInstitution_name().toLowerCase().contains(query.toLowerCase()))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(colleges.stream()
            .map(CollegeDataDto::new)
            .collect(Collectors.toList()));
    }
    
    /**
     * Get all branches offered by a specific college
     */
    @GetMapping("/colleges/{instcode}/branches")
    public ResponseEntity<List<String>> getAvailableBranches(@PathVariable String instcode) {
        log.info("Fetching available branches for college: {}", instcode);
        
        List<String> branches = repo.findAll().stream()
            .filter(c -> instcode.equals(c.getInstcode()))
            .map(College::getBranchCode)
            .filter(Objects::nonNull)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(branches);
    }
    
    /**
     * Reverse calculator - Calculate required rank for desired probability
     */
    @PostMapping("/reverse-calculator")
    public ResponseEntity<ReverseCalculatorDto> reverseCalculate(
            @RequestBody ReverseCalculatorRequestDto request) {
        log.info("Reverse calculator request: {}", request.getInstcode());
        
        College college = repo.findAll().stream()
            .filter(c -> request.getInstcode().equals(c.getInstcode()))
            .filter(c -> request.getBranch().equals(c.getBranchCode()))
            .findFirst()
            .orElseThrow(() -> new InvalidRequestException("College not found"));
        
        Integer cutoff = service.getCutoffForCategory(college, request.getCategory());
        
        if (cutoff == null) {
            throw new InvalidRequestException("No cutoff data for this category");
        }
        
        // Reverse the probability formula
        Integer requiredRank;
        Double desiredProb = request.getDesiredProbability();
        
        if (desiredProb >= 85) {
            requiredRank = (int) (cutoff * 0.95);
        } else if (desiredProb >= 40) {
            double range = cutoff * 1.10 - cutoff * 0.95;
            double offset = ((85.0 - desiredProb) / 45.0) * range;
            requiredRank = (int) (cutoff * 0.95 + offset);
        } else {
            requiredRank = (int) (cutoff * 1.10);
        }
        
        return ResponseEntity.ok(new ReverseCalculatorDto(
            college.getInstitution_name(),
            request.getBranch(),
            cutoff,
            requiredRank,
            desiredProb
        ));
    }
    
    /**
     * Get colleges offering a specific branch
     */
    @GetMapping("/branches/availability")
    public ResponseEntity<List<BranchAvailabilityDto>> getBranchAvailability(
            @RequestParam String branch) {
        log.info("Fetching colleges offering branch: {}", branch);
        
        Map<String, List<College>> collegesByInstcode = repo.findAll().stream()
            .filter(c -> branch.equals(c.getBranchCode()))
            .collect(Collectors.groupingBy(College::getInstcode));
        
        List<BranchAvailabilityDto> result = collegesByInstcode.entrySet().stream()
            .map(entry -> {
                College college = entry.getValue().get(0);
                return new BranchAvailabilityDto(
                    college.getInstcode(),
                    college.getInstitution_name(),
                    college.getDistrict(),
                    college.getRegion(),
                    college.getTier()
                );
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * Get cutoff distribution across all categories for a college-branch
     */
    @GetMapping("/cutoff-distribution/{instcode}/{branch}")
    public ResponseEntity<CutoffDistributionDto> getCutoffDistribution(
            @PathVariable String instcode,
            @PathVariable String branch) {
        log.info("Fetching cutoff distribution for {} - {}", instcode, branch);
        
        College college = repo.findAll().stream()
            .filter(c -> instcode.equals(c.getInstcode()))
            .filter(c -> branch.equals(c.getBranchCode()))
            .findFirst()
            .orElseThrow(() -> new InvalidRequestException("College not found"));
        
        Map<String, Integer> cutoffMap = new HashMap<>();
        cutoffMap.put("oc_boys", college.getOcBoys());
        cutoffMap.put("oc_girls", college.getOcGirls());
        cutoffMap.put("sc_boys", college.getScBoys());
        cutoffMap.put("sc_girls", college.getScGirls());
        cutoffMap.put("st_boys", college.getStBoys());
        cutoffMap.put("st_girls", college.getStGirls());
        cutoffMap.put("bca_boys", college.getBcaBoys());
        cutoffMap.put("bca_girls", college.getBcaGirls());
        cutoffMap.put("bcb_boys", college.getBcbBoys());
        cutoffMap.put("bcb_girls", college.getBcbGirls());
        cutoffMap.put("bcc_boys", college.getBccBoys());
        cutoffMap.put("bcc_girls", college.getBccGirls());
        cutoffMap.put("bcd_boys", college.getBcdBoys());
        cutoffMap.put("bcd_girls", college.getBcdGirls());
        cutoffMap.put("bce_boys", college.getBceBoys());
        cutoffMap.put("bce_girls", college.getBceGirls());
        cutoffMap.put("oc_ews_boys", college.getOcEwsBoys());
        cutoffMap.put("oc_ews_girls", college.getOcEwsGirls());
        
        IntSummaryStatistics stats = cutoffMap.values().stream()
            .filter(Objects::nonNull)
            .filter(v -> v > 0)
            .mapToInt(Integer::intValue)
            .summaryStatistics();
        
        return ResponseEntity.ok(new CutoffDistributionDto(
            college.getInstitution_name(),
            branch,
            cutoffMap,
            stats.getCount() > 0 ? (int) stats.getMin() : 0,
            stats.getCount() > 0 ? (int) stats.getMax() : 0,
            stats.getCount() > 0 ? (int) stats.getAverage() : 0
        ));
    }
    
    /**
     * Rank colleges by placement quality
     */
    @GetMapping("/rankings/by-placement")
    public ResponseEntity<List<PlacementRankingDto>> getRankingsByPlacement(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String tier) {
        log.info("Fetching placement rankings - branch: {}, tier: {}", branch, tier);
        
        Stream<College> collegeStream = repo.findAll().stream();
        
        if (branch != null) {
            collegeStream = collegeStream.filter(c -> branch.equals(c.getBranchCode()));
        }
        
        if (tier != null) {
            collegeStream = collegeStream.filter(c -> tier.equals(c.getTier()));
        }
        
        List<PlacementRankingDto> rankings = collegeStream
            .filter(c -> c.getAveragePackage() != null)
            .sorted((a, b) -> {
                int qualityCompare = service.getQualityScore(b.getPlacementDriveQuality())
                    .compareTo(service.getQualityScore(a.getPlacementDriveQuality()));
                
                if (qualityCompare != 0) return qualityCompare;
                
                return Double.compare(
                    b.getAveragePackage() != null ? b.getAveragePackage() : 0,
                    a.getAveragePackage() != null ? a.getAveragePackage() : 0
                );
            })
            .limit(50)
            .map(c -> new PlacementRankingDto(
                c.getInstitution_name(),
                c.getBranchCode(),
                c.getAveragePackage(),
                c.getHighestPackage(),
                c.getPlacementDriveQuality(),
                c.getTier()
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(rankings);
    }
    
    /**
     * Find colleges similar to the selected one
     */
    @GetMapping("/similar-colleges/{instcode}/{branch}")
    public ResponseEntity<List<SimilarCollegeDto>> findSimilarColleges(
            @PathVariable String instcode,
            @PathVariable String branch,
            @RequestParam String category) {
        log.info("Finding similar colleges for {} - {}", instcode, branch);
        
        College targetCollege = repo.findAll().stream()
            .filter(c -> instcode.equals(c.getInstcode()))
            .filter(c -> branch.equals(c.getBranchCode()))
            .findFirst()
            .orElseThrow(() -> new InvalidRequestException("College not found"));
        
        Integer targetCutoff = service.getCutoffForCategory(targetCollege, category);
        Double targetPackage = targetCollege.getAveragePackage();
        
        List<SimilarCollegeDto> similar = repo.findAll().stream()
            .filter(c -> branch.equals(c.getBranchCode()))
            .filter(c -> !instcode.equals(c.getInstcode()))
            .map(c -> {
                Integer cutoff = service.getCutoffForCategory(c, category);
                if (cutoff == null || targetCutoff == null) return null;
                
                double cutoffDiff = Math.abs(cutoff - targetCutoff) / (double) targetCutoff;
                if (cutoffDiff > 0.15) return null;
                
                if (c.getAveragePackage() == null || targetPackage == null) return null;
                double packageDiff = Math.abs(c.getAveragePackage() - targetPackage) / targetPackage;
                if (packageDiff > 0.20) return null;
                
                double similarityScore = 100 - (cutoffDiff * 50 + packageDiff * 50);
                
                return new SimilarCollegeDto(
                    c.getInstcode(),
                    c.getInstitution_name(),
                    c.getBranchCode(),
                    cutoff,
                    c.getAveragePackage(),
                    c.getTier(),
                    similarityScore
                );
            })
            .filter(Objects::nonNull)
            .sorted((a, b) -> Double.compare(b.getSimilarityScore(), a.getSimilarityScore()))
            .limit(10)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(similar);
    }
    
    /**
     * Smart recommendations based on user preferences
     */
    @PostMapping("/recommendations")
    public ResponseEntity<List<RecommendationDto>> getRecommendations(
            @RequestBody RecommendationRequestDto request) {
        log.info("Generating recommendations for rank: {}", request.getRank());
        
        List<CollegeResult> allResults = service.findColleges(
            request.getRank(),
            request.getBranch() != null ? List.of(request.getBranch()) : null,
            request.getCategory(),
            null,
            request.getPreferredRegions(),
            null,
            null,
            request.getGender()
        );
        
        List<RecommendationDto> recommendations = allResults.stream()
            .map(college -> {
                double score = 0.0;
                
                if (college.getProbability() != null) {
                    score += (college.getProbability() / 100.0) * 40;
                }
                
                int placementScore = service.getQualityScore(college.getPlacementDriveQuality());
                score += (placementScore / 4.0) * 30;
                
                if (college.getAveragePackage() != null) {
                    score += Math.min(college.getAveragePackage() / 10.0, 1.0) * 20;
                }
                
                double tierScore = service.getTierScore(college.getTier());
                score += tierScore * 10;
                
                return new RecommendationDto(
                    college,
                    score,
                    service.getRecommendationType(college.getProbability())
                );
            })
            .sorted((a, b) -> Double.compare(b.getRecommendationScore(), a.getRecommendationScore()))
            .limit(20)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(recommendations);
    }
}