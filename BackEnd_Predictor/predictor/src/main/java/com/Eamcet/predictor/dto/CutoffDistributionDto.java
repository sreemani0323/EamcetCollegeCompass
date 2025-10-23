package com.Eamcet.predictor.dto;

import java.util.Map;

public class CutoffDistributionDto {
    private String collegeName;
    private String branch;
    private Map<String, Integer> cutoffByCategory;
    private Integer minCutoff;
    private Integer maxCutoff;
    private Integer avgCutoff;
    
    public CutoffDistributionDto() {}
    
    public CutoffDistributionDto(String collegeName, String branch, Map<String, Integer> cutoffByCategory,
                                Integer minCutoff, Integer maxCutoff, Integer avgCutoff) {
        this.collegeName = collegeName;
        this.branch = branch;
        this.cutoffByCategory = cutoffByCategory;
        this.minCutoff = minCutoff;
        this.maxCutoff = maxCutoff;
        this.avgCutoff = avgCutoff;
    }
    
    // Getters and Setters
    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    
    public Map<String, Integer> getCutoffByCategory() { return cutoffByCategory; }
    public void setCutoffByCategory(Map<String, Integer> cutoffByCategory) { this.cutoffByCategory = cutoffByCategory; }
    
    public Integer getMinCutoff() { return minCutoff; }
    public void setMinCutoff(Integer minCutoff) { this.minCutoff = minCutoff; }
    
    public Integer getMaxCutoff() { return maxCutoff; }
    public void setMaxCutoff(Integer maxCutoff) { this.maxCutoff = maxCutoff; }
    
    public Integer getAvgCutoff() { return avgCutoff; }
    public void setAvgCutoff(Integer avgCutoff) { this.avgCutoff = avgCutoff; }
}
