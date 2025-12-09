package com.Eamcet.predictor.dto;

import com.Eamcet.predictor.service.CollegePredictorService.CollegeResult;

/**
 * Data Transfer Object for college recommendations.
 * Contains detailed college information along with recommendation scores and types.
 * 
 * This DTO is used to provide scored recommendations to students based on their rank
 * and preferences, helping them make informed decisions about college selection.
 */
public class RecommendationDto {
    /**
     * Institution code uniquely identifying the college.
     */
    private String instcode;
    
    /**
     * Name of the college/institution.
     */
    private String collegeName;
    
    /**
     * Branch code offered by the college.
     */
    private String branch;
    
    /**
     * Cutoff rank for the specific category.
     */
    private Integer cutoff;
    
    /**
     * Calculated probability of admission based on rank and cutoff.
     */
    private Double probability;
    
    /**
     * Average package offered during placements.
     */
    private Double averagePackage;
    
    /**
     * Quality rating of the placement drive.
     */
    private String placementQuality;
    
    /**
     * Tier classification of the college.
     */
    private String tier;
    
    /**
     * District where the college is located.
     */
    private String district;
    
    /**
     * Region where the college is located.
     */
    private String region;
    
    /**
     * Recommendation score calculated based on multiple factors.
     */
    private Double recommendationScore;
    
    /**
     * Recommendation type (SAFE, MODERATE, REACH, EXPLORE).
     */
    private String recommendationType;
    
    /**
     * Default constructor required for JSON serialization.
     */
    public RecommendationDto() {}
    
    /**
     * Constructor for creating a RecommendationDto from a CollegeResult and score.
     * 
     * @param college The college result containing basic information
     * @param score The calculated recommendation score
     * @param type The recommendation type
     */
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
    
    // Getter and setter methods
    
    /**
     * Gets the institution code.
     * 
     * @return The institution code
     */
    public String getInstcode() { return instcode; }
    
    /**
     * Sets the institution code.
     * 
     * @param instcode The institution code to set
     */
    public void setInstcode(String instcode) { this.instcode = instcode; }
    
    /**
     * Gets the college name.
     * 
     * @return The college name
     */
    public String getCollegeName() { return collegeName; }
    
    /**
     * Sets the college name.
     * 
     * @param collegeName The college name to set
     */
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    
    /**
     * Gets the branch code.
     * 
     * @return The branch code
     */
    public String getBranch() { return branch; }
    
    /**
     * Sets the branch code.
     * 
     * @param branch The branch code to set
     */
    public void setBranch(String branch) { this.branch = branch; }
    
    /**
     * Gets the cutoff rank.
     * 
     * @return The cutoff rank
     */
    public Integer getCutoff() { return cutoff; }
    
    /**
     * Sets the cutoff rank.
     * 
     * @param cutoff The cutoff rank to set
     */
    public void setCutoff(Integer cutoff) { this.cutoff = cutoff; }
    
    /**
     * Gets the admission probability.
     * 
     * @return The admission probability
     */
    public Double getProbability() { return probability; }
    
    /**
     * Sets the admission probability.
     * 
     * @param probability The admission probability to set
     */
    public void setProbability(Double probability) { this.probability = probability; }
    
    /**
     * Gets the average package.
     * 
     * @return The average package
     */
    public Double getAveragePackage() { return averagePackage; }
    
    /**
     * Sets the average package.
     * 
     * @param averagePackage The average package to set
     */
    public void setAveragePackage(Double averagePackage) { this.averagePackage = averagePackage; }
    
    /**
     * Gets the placement quality rating.
     * 
     * @return The placement quality rating
     */
    public String getPlacementQuality() { return placementQuality; }
    
    /**
     * Sets the placement quality rating.
     * 
     * @param placementQuality The placement quality rating to set
     */
    public void setPlacementQuality(String placementQuality) { this.placementQuality = placementQuality; }
    
    /**
     * Gets the tier classification.
     * 
     * @return The tier classification
     */
    public String getTier() { return tier; }
    
    /**
     * Sets the tier classification.
     * 
     * @param tier The tier classification to set
     */
    public void setTier(String tier) { this.tier = tier; }
    
    /**
     * Gets the district.
     * 
     * @return The district
     */
    public String getDistrict() { return district; }
    
    /**
     * Sets the district.
     * 
     * @param district The district to set
     */
    public void setDistrict(String district) { this.district = district; }
    
    /**
     * Gets the region.
     * 
     * @return The region
     */
    public String getRegion() { return region; }
    
    /**
     * Sets the region.
     * 
     * @param region The region to set
     */
    public void setRegion(String region) { this.region = region; }
    
    /**
     * Gets the recommendation score.
     * 
     * @return The recommendation score
     */
    public Double getRecommendationScore() { return recommendationScore; }
    
    /**
     * Sets the recommendation score.
     * 
     * @param recommendationScore The recommendation score to set
     */
    public void setRecommendationScore(Double recommendationScore) { this.recommendationScore = recommendationScore; }
    
    /**
     * Gets the recommendation type.
     * 
     * @return The recommendation type
     */
    public String getRecommendationType() { return recommendationType; }
    
    /**
     * Sets the recommendation type.
     * 
     * @param recommendationType The recommendation type to set
     */
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }
}