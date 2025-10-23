package com.Eamcet.predictor.dto;

public class PlacementRankingDto {
    private String collegeName;
    private String branch;
    private Double averagePackage;
    private Double highestPackage;
    private String placementQuality;
    private String tier;
    
    public PlacementRankingDto() {}
    
    public PlacementRankingDto(String collegeName, String branch, Double averagePackage,
                              Double highestPackage, String placementQuality, String tier) {
        this.collegeName = collegeName;
        this.branch = branch;
        this.averagePackage = averagePackage;
        this.highestPackage = highestPackage;
        this.placementQuality = placementQuality;
        this.tier = tier;
    }
    
    // Getters and Setters
    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    
    public Double getAveragePackage() { return averagePackage; }
    public void setAveragePackage(Double averagePackage) { this.averagePackage = averagePackage; }
    
    public Double getHighestPackage() { return highestPackage; }
    public void setHighestPackage(Double highestPackage) { this.highestPackage = highestPackage; }
    
    public String getPlacementQuality() { return placementQuality; }
    public void setPlacementQuality(String placementQuality) { this.placementQuality = placementQuality; }
    
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
}
