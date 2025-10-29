package com.Eamcet.predictor.dto;

/**
 * Data Transfer Object for reverse calculator requests.
 * Contains the parameters needed to perform a reverse calculation to determine
 * the rank required for admission to a specific college with a desired probability.
 * 
 * This DTO is used as the request payload for the reverse calculator endpoint.
 */
public class ReverseCalculatorRequestDto {
    /**
     * Institution code of the target college.
     */
    private String instcode;
    
    /**
     * Branch code for which the calculation is performed.
     */
    private String branch;
    
    /**
     * Category for which the calculation is performed.
     */
    private String category;
    
    /**
     * Desired admission probability (e.g., 85 for 85% chance).
     */
    private Double desiredProbability;
    
    /**
     * Default constructor required for JSON serialization.
     */
    public ReverseCalculatorRequestDto() {}
    
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
     * Gets the category.
     * 
     * @return The category
     */
    public String getCategory() { return category; }
    
    /**
     * Sets the category.
     * 
     * @param category The category to set
     */
    public void setCategory(String category) { this.category = category; }
    
    /**
     * Gets the desired admission probability.
     * 
     * @return The desired probability
     */
    public Double getDesiredProbability() { return desiredProbability; }
    
    /**
     * Sets the desired admission probability.
     * 
     * @param desiredProbability The desired probability to set
     */
    public void setDesiredProbability(Double desiredProbability) { this.desiredProbability = desiredProbability; }
}