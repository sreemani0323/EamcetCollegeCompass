package com.Eamcet.predictor.dto;

public class BranchStatsDto {
    private String branch;
    private Integer totalColleges;
    private Double avgPackage;
    private Double maxPackage;
    private Double minPackage;
    
    public BranchStatsDto() {}
    
    public BranchStatsDto(String branch, Integer totalColleges, Double avgPackage, 
                         Double maxPackage, Double minPackage) {
        this.branch = branch;
        this.totalColleges = totalColleges;
        this.avgPackage = avgPackage;
        this.maxPackage = maxPackage;
        this.minPackage = minPackage;
    }
    
    // Getters and Setters
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    
    public Integer getTotalColleges() { return totalColleges; }
    public void setTotalColleges(Integer totalColleges) { this.totalColleges = totalColleges; }
    
    public Double getAvgPackage() { return avgPackage; }
    public void setAvgPackage(Double avgPackage) { this.avgPackage = avgPackage; }
    
    public Double getMaxPackage() { return maxPackage; }
    public void setMaxPackage(Double maxPackage) { this.maxPackage = maxPackage; }
    
    public Double getMinPackage() { return minPackage; }
    public void setMinPackage(Double minPackage) { this.minPackage = minPackage; }
}
