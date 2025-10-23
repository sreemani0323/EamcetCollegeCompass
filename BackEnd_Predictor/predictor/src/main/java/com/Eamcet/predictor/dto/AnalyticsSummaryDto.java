package com.Eamcet.predictor.dto;

import java.util.Map;

public class AnalyticsSummaryDto {
    private Integer totalColleges;
    private Map<String, Long> collegesByRegion;
    private Map<String, Long> collegesByTier;
    private Map<String, Long> collegesByBranch;
    private Double avgPackageOverall;
    private Map<String, Double> avgPackageByBranch;
    
    public AnalyticsSummaryDto() {}
    
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
    
    // Getters and Setters
    public Integer getTotalColleges() { return totalColleges; }
    public void setTotalColleges(Integer totalColleges) { this.totalColleges = totalColleges; }
    
    public Map<String, Long> getCollegesByRegion() { return collegesByRegion; }
    public void setCollegesByRegion(Map<String, Long> collegesByRegion) { this.collegesByRegion = collegesByRegion; }
    
    public Map<String, Long> getCollegesByTier() { return collegesByTier; }
    public void setCollegesByTier(Map<String, Long> collegesByTier) { this.collegesByTier = collegesByTier; }
    
    public Map<String, Long> getCollegesByBranch() { return collegesByBranch; }
    public void setCollegesByBranch(Map<String, Long> collegesByBranch) { this.collegesByBranch = collegesByBranch; }
    
    public Double getAvgPackageOverall() { return avgPackageOverall; }
    public void setAvgPackageOverall(Double avgPackageOverall) { this.avgPackageOverall = avgPackageOverall; }
    
    public Map<String, Double> getAvgPackageByBranch() { return avgPackageByBranch; }
    public void setAvgPackageByBranch(Map<String, Double> avgPackageByBranch) { this.avgPackageByBranch = avgPackageByBranch; }
}
