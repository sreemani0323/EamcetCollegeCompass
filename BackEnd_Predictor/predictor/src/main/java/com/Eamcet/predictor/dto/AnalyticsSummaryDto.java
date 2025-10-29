package com.Eamcet.predictor.dto;

import java.util.Map;

/**
 * Data Transfer Object for analytics summary information.
 * Contains aggregated statistics about colleges including counts by region, tier, and branch,
 * as well as package information.
 * 
 * This DTO is used to provide overview analytics data to the frontend for dashboard display.
 */
public class AnalyticsSummaryDto {
    /**
     * Total number of unique colleges in the database.
     */
    private Integer totalColleges;
    
    /**
     * Map of region names to college counts in each region.
     */
    private Map<String, Long> collegesByRegion;
    
    /**
     * Map of tier classifications to college counts in each tier.
     */
    private Map<String, Long> collegesByTier;
    
    /**
     * Map of branch codes to college counts for each branch.
     */
    private Map<String, Long> collegesByBranch;
    
    /**
     * Overall average package across all colleges.
     */
    private Double avgPackageOverall;
    
    /**
     * Map of branch codes to average packages for each branch.
     */
    private Map<String, Double> avgPackageByBranch;
    
    /**
     * Default constructor required for JSON serialization.
     */
    public AnalyticsSummaryDto() {}
    
    /**
     * Constructor for creating an AnalyticsSummaryDto with all data.
     * 
     * @param totalColleges Total number of unique colleges
     * @param collegesByRegion Map of colleges grouped by region
     * @param collegesByTier Map of colleges grouped by tier
     * @param collegesByBranch Map of colleges grouped by branch
     * @param avgPackageOverall Overall average package across all colleges
     * @param avgPackageByBranch Map of average packages by branch
     */
    public AnalyticsSummaryDto(Integer totalColleges, Map<String, Long> collegesByRegion,
                               Map<String, Long> collegesByTier, Map<String, Long> collegesByBranch,
                               Double avgPackageOverall, Map<String, Double> avgPackageByBranch) {
        this.totalColleges = totalColleges;
        this.collegesByRegion = collegesByRegion;
        this.collegesByTier = collegesByTier;
        this.collegesByBranch = collegesByBranch;
        this.avgPackageOverall = avgPackageOverall;
        this.avgPackageByBranch = avgPackageByBranch;
    }
    
    /**
     * Gets the total number of colleges.
     * 
     * @return The total colleges count
     */
    public Integer getTotalColleges() { return totalColleges; }
    
    /**
     * Sets the total number of colleges.
     * 
     * @param totalColleges The total colleges count to set
     */
    public void setTotalColleges(Integer totalColleges) { this.totalColleges = totalColleges; }
    
    /**
     * Gets the map of colleges by region.
     * 
     * @return Map of region names to college counts
     */
    public Map<String, Long> getCollegesByRegion() { return collegesByRegion; }
    
    /**
     * Sets the map of colleges by region.
     * 
     * @param collegesByRegion Map of region names to college counts
     */
    public void setCollegesByRegion(Map<String, Long> collegesByRegion) { this.collegesByRegion = collegesByRegion; }
    
    /**
     * Gets the map of colleges by tier.
     * 
     * @return Map of tier names to college counts
     */
    public Map<String, Long> getCollegesByTier() { return collegesByTier; }
    
    /**
     * Sets the map of colleges by tier.
     * 
     * @param collegesByTier Map of tier names to college counts
     */
    public void setCollegesByTier(Map<String, Long> collegesByTier) { this.collegesByTier = collegesByTier; }
    
    /**
     * Gets the map of colleges by branch.
     * 
     * @return Map of branch codes to college counts
     */
    public Map<String, Long> getCollegesByBranch() { return collegesByBranch; }
    
    /**
     * Sets the map of colleges by branch.
     * 
     * @param collegesByBranch Map of branch codes to college counts
     */
    public void setCollegesByBranch(Map<String, Long> collegesByBranch) { this.collegesByBranch = collegesByBranch; }
    
    /**
     * Gets the overall average package.
     * 
     * @return The overall average package
     */
    public Double getAvgPackageOverall() { return avgPackageOverall; }
    
    /**
     * Sets the overall average package.
     * 
     * @param avgPackageOverall The overall average package to set
     */
    public void setAvgPackageOverall(Double avgPackageOverall) { this.avgPackageOverall = avgPackageOverall; }
    
    /**
     * Gets the map of average packages by branch.
     * 
     * @return Map of branch codes to average packages
     */
    public Map<String, Double> getAvgPackageByBranch() { return avgPackageByBranch; }
    
    /**
     * Sets the map of average packages by branch.
     * 
     * @param avgPackageByBranch Map of branch codes to average packages
     */
    public void setAvgPackageByBranch(Map<String, Double> avgPackageByBranch) { this.avgPackageByBranch = avgPackageByBranch; }
}