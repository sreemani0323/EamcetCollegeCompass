package com.Eamcet.predictor.dto;

/**
 * Data Transfer Object for similar colleges.
 * Contains information about colleges that are similar to a target college
 * based on cutoff ranks and placement packages.
 * 
 * This DTO is used to provide recommendations of similar colleges to students
 * who are interested in a specific college.
 */
public class SimilarCollegeDto {
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
     * Cutoff rank for the specified category.
     */
    private Integer cutoff;
    
    /**
     * Average package offered during placements.
     */
    private Double averagePackage;
    
    /**
     * Tier classification of the college.
     */
    private String tier;
    
    /**
     * Similarity score calculated based on cutoff and package similarity.
     */
    private Double similarityScore;
    
    /**
     * Default constructor required for JSON serialization.
     */
    public SimilarCollegeDto() {}
    
    /**
     * Constructor for creating a SimilarCollegeDto with all data.
     * 
     * @param instcode Institution code of the college
     * @param collegeName Name of the college
     * @param branch Branch code
     * @param cutoff Cutoff rank
     * @param averagePackage Average package
     * @param tier Tier classification
     * @param similarityScore Calculated similarity score
     */
    public SimilarCollegeDto(String instcode, String collegeName, String branch, Integer cutoff,
                            Double averagePackage, String tier, Double similarityScore) {
        this.instcode = instcode;
        this.collegeName = collegeName;
        this.branch = branch;
        this.cutoff = cutoff;
        this.averagePackage = averagePackage;
        this.tier = tier;
        this.similarityScore = similarityScore;
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
     * Gets the similarity score.
     * 
     * @return The similarity score
     */
    public Double getSimilarityScore() { return similarityScore; }
    
    /**
     * Sets the similarity score.
     * 
     * @param similarityScore The similarity score to set
     */
    public void setSimilarityScore(Double similarityScore) { this.similarityScore = similarityScore; }
}