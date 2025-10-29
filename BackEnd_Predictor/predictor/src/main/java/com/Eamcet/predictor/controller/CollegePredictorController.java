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

/**
 * REST controller for the College Predictor application.
 * Provides endpoints for college predictions, analytics, search, and related functionalities.
 * 
 * This controller handles requests for predicting colleges based on EAMCET ranks and various filters,
 * as well as providing analytics, search, and comparison features.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"https://sreemani0323.github.io", "http://localhost:5500", "http://127.0.0.1:5500", "null"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class CollegePredictorController {

    private static final Logger log = LoggerFactory.getLogger(CollegePredictorController.class);
    private final CollegePredictorService service;
    private final CollegeRepository repo;

    /**
     * Constructor for dependency injection of required services.
     * 
     * @param service The college predictor service for business logic
     * @param repo The college repository for database operations
     */
    public CollegePredictorController(CollegePredictorService service, CollegeRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    /**
     * Predicts colleges based on EAMCET rank and various filters.
     * This is the main endpoint for college predictions.
     * 
     * @param payload Request payload containing rank, branches, category, districts, regions, tiers, placement qualities, and gender
     * @return ResponseEntity containing list of predicted colleges or error message
     */
    @PostMapping("/predict-colleges")
    public ResponseEntity<?> predict(@RequestBody Map<String, Object> payload) {
        log.debug("Received predict request with payload: {}", payload);
        
        // Function to extract and split comma-separated values from payload
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
        
        // Function to extract single string values from payload
        Function<String, String> extractSingle = key ->
                Optional.ofNullable(payload.get(key))
                        .filter(obj -> obj instanceof String)
                        .map(String.class::cast)
                        .filter(s -> !s.trim().isEmpty())
                        .orElse(null);

        // Extract rank from payload, validating it's a positive number
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

        // Extract filter parameters from payload
        List<String> branches = extractAndSplit.apply("branch");
        List<String> districts = extractAndSplit.apply("district");
        List<String> regions = extractAndSplit.apply("region");
        List<String> tiers = extractAndSplit.apply("tier");
        List<String> placementQualities = extractAndSplit.apply("placementQualityFilter");
        
        String category = extractSingle.apply("category");
        String gender = extractSingle.apply("gender");

        // Check if any filters are provided
        boolean hasFilters = branches != null || category != null || districts != null || 
                            regions != null || tiers != null || placementQualities != null || gender != null;

        log.info("Request parameters: rank={}, branches={}, category={}, districts={}, regions={}, tiers={}, gender={}, placementQualities={}, hasFilters={}",
                rank, branches, category, districts, regions, tiers, gender, placementQualities, hasFilters);

        // If no rank and no filters, return all colleges
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

        // Find colleges based on provided parameters
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
     * Retrieves analytics summary data including college counts by region, tier, and branch,
     * as well as average package information.
     * 
     * @return ResponseEntity containing analytics summary data
     */
    @GetMapping("/analytics/summary")
    public ResponseEntity<AnalyticsSummaryDto> getAnalyticsSummary() {
        log.info("Fetching analytics summary");
        List<College> allColleges = repo.findAll();
        
        // Group colleges by region and count them
        Map<String, Long> collegesByRegion = allColleges.stream()
            .filter(c -> c.getRegion() != null)
            .collect(Collectors.groupingBy(College::getRegion, Collectors.counting()));
        
        // Group colleges by tier and count them
        Map<String, Long> collegesByTier = allColleges.stream()
            .filter(c -> c.getTier() != null)
            .collect(Collectors.groupingBy(College::getTier, Collectors.counting()));
        
        // Group colleges by branch and count them
        Map<String, Long> collegesByBranch = allColleges.stream()
            .filter(c -> c.getBranchCode() != null)
            .collect(Collectors.groupingBy(College::getBranchCode, Collectors.counting()));
        
        // Calculate overall average package across all colleges
        Double avgPackageOverall = allColleges.stream()
            .filter(c -> c.getAveragePackage() != null)
            .mapToDouble(College::getAveragePackage)
            .average()
            .orElse(0.0);
        
        // Calculate average package by branch
        Map<String, Double> avgPackageByBranch = allColleges.stream()
            .filter(c -> c.getBranchCode() != null && c.getAveragePackage() != null)
            .collect(Collectors.groupingBy(
                College::getBranchCode,
                Collectors.averagingDouble(College::getAveragePackage)
            ));
        
        // Count unique colleges by instcode
        long uniqueCollegesCount = allColleges.stream()
            .map(College::getInstcode)
            .distinct()
            .count();
        
        // Create and return analytics summary DTO
        AnalyticsSummaryDto summary = new AnalyticsSummaryDto(
            (int) uniqueCollegesCount,
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
     * Retrieves all unique branches available in the college database.
     * 
     * @return ResponseEntity containing list of all unique branches
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
     * Retrieves statistics for a specific branch including count of colleges,
     * average, maximum, and minimum packages.
     * 
     * @param branch The branch code to get statistics for
     * @return ResponseEntity containing branch statistics
     */
    @GetMapping("/analytics/branch-stats/{branch}")
    public ResponseEntity<BranchStatsDto> getBranchStats(@PathVariable String branch) {
        log.info("Fetching branch stats for: {}", branch);
        
        List<College> branchColleges = repo.findAll().stream()
            .filter(c -> branch.equals(c.getBranchCode()))
            .collect(Collectors.toList());
        
        // Calculate package statistics for the branch
        DoubleSummaryStatistics packageStats = branchColleges.stream()
            .filter(c -> c.getAveragePackage() != null)
            .mapToDouble(College::getAveragePackage)
            .summaryStatistics();
        
        // Create and return branch stats DTO
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
     * Searches for colleges by name (case-insensitive partial match).
     * 
     * @param query The search query string
     * @return ResponseEntity containing list of colleges matching the search query
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
     * Retrieves all available branches for a specific college identified by instcode.
     * 
     * @param instcode The institution code of the college
     * @return ResponseEntity containing list of branches offered by the college
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
     * Performs reverse calculation to determine the rank required for admission
     * to a specific college and branch with a desired probability.
     * 
     * @param request The reverse calculator request containing instcode, branch, category, and desired probability
     * @return ResponseEntity containing the required rank for the desired probability
     */
    @PostMapping("/reverse-calculator")
    public ResponseEntity<ReverseCalculatorDto> reverseCalculate(
            @RequestBody ReverseCalculatorRequestDto request) {
        log.info("Reverse calculator request: {}", request.getInstcode());
        
        // Find the college by instcode and branch
        College college = repo.findAll().stream()
            .filter(c -> request.getInstcode().equals(c.getInstcode()))
            .filter(c -> request.getBranch().equals(c.getBranchCode()))
            .findFirst()
            .orElseThrow(() -> new InvalidRequestException("College not found"));
        
        // Get cutoff for the specified category
        Integer cutoff = service.getCutoffForCategory(college, request.getCategory());
        
        if (cutoff == null) {
            throw new InvalidRequestException("No cutoff data for this category");
        }
        
        // Calculate required rank based on desired probability
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
        
        // Create and return reverse calculator DTO
        return ResponseEntity.ok(new ReverseCalculatorDto(
            college.getInstitution_name(),
            request.getBranch(),
            cutoff,
            requiredRank,
            desiredProb
        ));
    }
    
    /**
     * Retrieves colleges that offer a specific branch.
     * 
     * @param branch The branch code to search for
     * @return ResponseEntity containing list of colleges offering the specified branch
     */
    @GetMapping("/branches/availability")
    public ResponseEntity<List<BranchAvailabilityDto>> getBranchAvailability(
            @RequestParam String branch) {
        log.info("Fetching colleges offering branch: {}", branch);
        
        // Group colleges by instcode
        Map<String, List<College>> collegesByInstcode = repo.findAll().stream()
            .filter(c -> branch.equals(c.getBranchCode()))
            .collect(Collectors.groupingBy(College::getInstcode));
        
        // Create availability DTOs for each college
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
     * Retrieves cutoff distribution data for a specific college and branch across all categories.
     * 
     * @param instcode The institution code of the college
     * @param branch The branch code
     * @return ResponseEntity containing cutoff distribution data
     */
    @GetMapping("/cutoff-distribution/{instcode}/{branch}")
    public ResponseEntity<CutoffDistributionDto> getCutoffDistribution(
            @PathVariable String instcode,
            @PathVariable String branch) {
        log.info("Fetching cutoff distribution for {} - {}", instcode, branch);
        
        // Find the college by instcode and branch
        College college = repo.findAll().stream()
            .filter(c -> instcode.equals(c.getInstcode()))
            .filter(c -> branch.equals(c.getBranchCode()))
            .findFirst()
            .orElseThrow(() -> new InvalidRequestException("College not found"));
        
        // Create map of cutoffs by category
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
        
        // Calculate statistics for cutoff values
        IntSummaryStatistics stats = cutoffMap.values().stream()
            .filter(Objects::nonNull)
            .filter(v -> v > 0)
            .mapToInt(Integer::intValue)
            .summaryStatistics();
        
        // Create and return cutoff distribution DTO
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
     * Retrieves colleges ranked by placement package, optionally filtered by branch and tier.
     * 
     * @param branch Optional branch filter
     * @param tier Optional tier filter
     * @return ResponseEntity containing list of colleges ranked by placement package
     */
    @GetMapping("/rankings/by-placement")
    public ResponseEntity<List<PlacementRankingDto>> getRankingsByPlacement(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String tier) {
        log.info("Fetching placement rankings - branch: {}, tier: {}", branch, tier);
        
        // Start with all colleges and apply filters
        Stream<College> collegeStream = repo.findAll().stream();
        
        if (branch != null) {
            collegeStream = collegeStream.filter(c -> branch.equals(c.getBranchCode()));
        }
        
        if (tier != null) {
            collegeStream = collegeStream.filter(c -> tier.equals(c.getTier()));
        }
        
        // Sort colleges by placement quality and average package
        List<PlacementRankingDto> rankings = collegeStream
            .filter(c -> c.getAveragePackage() != null)
            .sorted((a, b) -> {
                // First sort by placement quality score (higher is better)
                int qualityCompare = service.getQualityScore(b.getPlacementDriveQuality())
                    .compareTo(service.getQualityScore(a.getPlacementDriveQuality()));
                
                if (qualityCompare != 0) return qualityCompare;
                
                // Then sort by average package (higher is better)
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
     * Finds colleges similar to a specified college based on cutoff and package metrics.
     * 
     * @param instcode The institution code of the target college
     * @param branch The branch code of the target college
     * @param category The category to compare cutoffs
     * @return ResponseEntity containing list of similar colleges
     */
    @GetMapping("/similar-colleges/{instcode}/{branch}")
    public ResponseEntity<List<SimilarCollegeDto>> findSimilarColleges(
            @PathVariable String instcode,
            @PathVariable String branch,
            @RequestParam String category) {
        log.info("Finding similar colleges for {} - {}", instcode, branch);
        
        // Find the target college
        College targetCollege = repo.findAll().stream()
            .filter(c -> instcode.equals(c.getInstcode()))
            .filter(c -> branch.equals(c.getBranchCode()))
            .findFirst()
            .orElseThrow(() -> new InvalidRequestException("College not found"));
        
        // Get cutoff and package information for the target college
        Integer targetCutoff = service.getCutoffForCategory(targetCollege, category);
        Double targetPackage = targetCollege.getAveragePackage();
        
        // Find similar colleges based on cutoff and package similarity
        List<SimilarCollegeDto> similar = repo.findAll().stream()
            .filter(c -> branch.equals(c.getBranchCode()))
            .filter(c -> !instcode.equals(c.getInstcode()))
            .map(c -> {
                // Get cutoff for the current college
                Integer cutoff = service.getCutoffForCategory(c, category);
                if (cutoff == null || targetCutoff == null) return null;
                
                // Calculate cutoff difference percentage
                double cutoffDiff = Math.abs(cutoff - targetCutoff) / (double) targetCutoff;
                if (cutoffDiff > 0.15) return null; // Max 15% difference allowed
                
                // Check package similarity
                if (c.getAveragePackage() == null || targetPackage == null) return null;
                double packageDiff = Math.abs(c.getAveragePackage() - targetPackage) / targetPackage;
                if (packageDiff > 0.20) return null; // Max 20% difference allowed
                
                // Calculate similarity score based on cutoff and package differences
                double similarityScore = 100 - (cutoffDiff * 50 + packageDiff * 50);
                
                // Create and return similar college DTO
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
     * Generates college recommendations based on rank and preferences.
     * 
     * @param request The recommendation request containing rank, branch, category, gender, and preferred regions
     * @return ResponseEntity containing list of recommended colleges with scores
     */
    @PostMapping("/recommendations")
    public ResponseEntity<List<RecommendationDto>> getRecommendations(
            @RequestBody RecommendationRequestDto request) {
        log.info("Generating recommendations for rank: {}", request.getRank());
        
        // Find colleges based on the request parameters
        List<CollegeResult> allResults = service.findColleges(
            request.getRank(),
            request.getBranch() != null ? List.of(request.getBranch()) : null,
            request.getCategory(),
            null, // districts
            request.getPreferredRegions(), // regions
            null, // tiers
            null, // placementQualities
            request.getGender()
        );
        
        // Score and sort colleges for recommendations
        List<RecommendationDto> recommendations = allResults.stream()
            .map(college -> {
                double score = 0.0;
                
                // Factor in admission probability (40% weight)
                if (college.getProbability() != null) {
                    score += (college.getProbability() / 100.0) * 40;
                }
                
                // Factor in placement quality (30% weight)
                int placementScore = service.getQualityScore(college.getPlacementDriveQuality());
                score += (placementScore / 4.0) * 30;
                
                // Factor in average package (20% weight)
                if (college.getAveragePackage() != null) {
                    score += Math.min(college.getAveragePackage() / 10.0, 1.0) * 20;
                }
                
                // Factor in college tier (10% weight)
                double tierScore = service.getTierScore(college.getTier());
                score += tierScore * 10;
                
                // Create and return recommendation DTO
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