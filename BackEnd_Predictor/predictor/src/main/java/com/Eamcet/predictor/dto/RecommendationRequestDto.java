package com.Eamcet.predictor.dto;

import java.util.List;

/**
 * Data Transfer Object for recommendation requests.
 * Contains the parameters needed to generate college recommendations for a student.
 * 
 * This DTO is used as the request payload for the recommendations endpoint.
 */
public class RecommendationRequestDto {
    /**
     * EAMCET rank of the student.
     */
    private Integer rank;
    
    /**
     * Reservation category of the student.
     */
    private String category;
    
    /**
     * Gender of the student.
     */
    private String gender;
    
    /**
     * Preferred branch (optional).
     */
    private String branch;
    
    /**
     * List of preferred regions (optional).
     */
    private List<String> preferredRegions;
    
    /**
     * Default constructor required for JSON serialization.
     */
    public RecommendationRequestDto() {}
    
    // Getter and setter methods
    
    /**
     * Gets the student's rank.
     * 
     * @return The rank
     */
    public Integer getRank() { return rank; }
    
    /**
     * Sets the student's rank.
     * 
     * @param rank The rank to set
     */
    public void setRank(Integer rank) { this.rank = rank; }
    
    /**
     * Gets the student's category.
     * 
     * @return The category
     */
    public String getCategory() { return category; }
    
    /**
     * Sets the student's category.
     * 
     * @param category The category to set
     */
    public void setCategory(String category) { this.category = category; }
    
    /**
     * Gets the student's gender.
     * 
     * @return The gender
     */
    public String getGender() { return gender; }
    
    /**
     * Sets the student's gender.
     * 
     * @param gender The gender to set
     */
    public void setGender(String gender) { this.gender = gender; }
    
    /**
     * Gets the preferred branch.
     * 
     * @return The preferred branch
     */
    public String getBranch() { return branch; }
    
    /**
     * Sets the preferred branch.
     * 
     * @param branch The preferred branch to set
     */
    public void setBranch(String branch) { this.branch = branch; }
    
    /**
     * Gets the list of preferred regions.
     * 
     * @return The list of preferred regions
     */
    public List<String> getPreferredRegions() { return preferredRegions; }
    
    /**
     * Sets the list of preferred regions.
     * 
     * @param preferredRegions The list of preferred regions to set
     */
    public void setPreferredRegions(List<String> preferredRegions) { this.preferredRegions = preferredRegions; }
}