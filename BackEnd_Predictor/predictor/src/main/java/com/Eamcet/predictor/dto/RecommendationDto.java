package com.Eamcet.predictor.dto;

import com.Eamcet.predictor.service.CollegePredictorService.CollegeResult;

public class RecommendationDto {
    private String instcode;
    private String collegeName;
    private String branch;
    private Integer cutoff;
    private Double probability;
    private Double averagePackage;
    private String placementQuality;
    private String tier;
    private String district;
    private String region;
    private Double recommendationScore;
    private String recommendationType;
    
    public RecommendationDto() {}
    
    public RecommendationDto(CollegeResult college, Double score, String type) {
        this.instcode = college.getInstcode();
        this.collegeName = college.getName();
        this.branch = college.getBranch();
        this.cutoff = college.getCutoff();
        this.probability = college.getProbability();
        this.averagePackage = college.getAveragePackage();
        this.placementQuality = college.getPlacementDriveQuality();
        this.tier = college.getTier();
        this.district = college.getDistrict();
        this.region = college.getRegion();
        this.recommendationScore = score;
        this.recommendationType = type;
    }
    
    // Getters and Setters
    public String getInstcode() { return instcode; }
    public void setInstcode(String instcode) { this.instcode = instcode; }
    
    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    
    public Integer getCutoff() { return cutoff; }
    public void setCutoff(Integer cutoff) { this.cutoff = cutoff; }
    
    public Double getProbability() { return probability; }
    public void setProbability(Double probability) { this.probability = probability; }
    
    public Double getAveragePackage() { return averagePackage; }
    public void setAveragePackage(Double averagePackage) { this.averagePackage = averagePackage; }
    
    public String getPlacementQuality() { return placementQuality; }
    public void setPlacementQuality(String placementQuality) { this.placementQuality = placementQuality; }
    
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public Double getRecommendationScore() { return recommendationScore; }
    public void setRecommendationScore(Double recommendationScore) { this.recommendationScore = recommendationScore; }
    
    public String getRecommendationType() { return recommendationType; }
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }
}
