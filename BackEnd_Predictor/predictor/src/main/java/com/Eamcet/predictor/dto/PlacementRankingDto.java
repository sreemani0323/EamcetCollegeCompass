package com.Eamcet.predictor.dto;

/**
 * Data Transfer Object for placement rankings.
 * Contains information about colleges ranked by placement package and quality.
 * 
 * This DTO is used to display colleges sorted by their placement performance.
 */
public class PlacementRankingDto {
    /**
     * Name of the college/institution.
     */
    private String collegeName;
    
    /**
     * Branch code offered by the college.
     */
    private String branch;
    
    /**
     * Average package offered during placements.
     */
    private Double averagePackage;
    
    /**
     * Highest package offered during placements.
     */
    private Double highestPackage;
    
    /**
     * Quality rating of the placement drive.
     */
    private String placementQuality;
    
    /**
     * Tier classification of the college.
     */
    private String tier;
    
    /**
     * Default constructor required for JSON serialization.
     */
    public PlacementRankingDto() {}
    
    /**
     * Constructor for creating a PlacementRankingDto with all data.
     * 
     * @param collegeName Name of the college
     * @param branch Branch code
     * @param averagePackage Average package offered
     * @param highestPackage Highest package offered
     * @param placementQuality Quality rating of placement drive
     * @param tier Tier classification of the college
     */
    public PlacementRankingDto(String collegeName, String branch, Double averagePackage,
                              Double highestPackage, String placementQuality, String tier) {
        this.collegeName = collegeName;
        this.branch = branch;
        this.averagePackage = averagePackage;
        this.highestPackage = highestPackage;
        this.placementQuality = placementQuality;
        this.tier = tier;
    }
    
    // Getter and setter methods
    
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
     * Gets the highest package.
     * 
     * @return The highest package
     */
    public Double getHighestPackage() { return highestPackage; }
    
    /**
     * Sets the highest package.
     * 
     * @param highestPackage The highest package to set
     */
    public void setHighestPackage(Double highestPackage) { this.highestPackage = highestPackage; }
    
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
}