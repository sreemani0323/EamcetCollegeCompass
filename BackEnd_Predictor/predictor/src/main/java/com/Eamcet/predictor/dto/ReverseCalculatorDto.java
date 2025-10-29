package com.Eamcet.predictor.dto;

/**
 * Data Transfer Object for reverse calculator results.
 * Contains the calculated rank required for admission to a specific college
 * and branch with a desired probability.
 * 
 * This DTO is used to provide results from the reverse calculator functionality
 * which determines what rank is needed for a specific admission chance.
 */
public class ReverseCalculatorDto {
    /**
     * Name of the college/institution.
     */
    private String collegeName;
    
    /**
     * Branch code for which the calculation applies.
     */
    private String branch;
    
    /**
     * Current cutoff rank for the specified category.
     */
    private Integer cutoff;
    
    /**
     * Calculated rank required for the desired admission probability.
     */
    private Integer requiredRank;
    
    /**
     * Desired admission probability used in the calculation.
     */
    private Double probability;
    
    /**
     * Human-readable message explaining the calculation result.
     */
    private String message;
    
    /**
     * Default constructor required for JSON serialization.
     */
    public ReverseCalculatorDto() {}
    
    /**
     * Constructor for creating a ReverseCalculatorDto with all data.
     * 
     * @param collegeName Name of the college
     * @param branch Branch code
     * @param cutoff Current cutoff rank
     * @param requiredRank Required rank for desired probability
     * @param probability Desired admission probability
     */
    public ReverseCalculatorDto(String collegeName, String branch, Integer cutoff, 
                               Integer requiredRank, Double probability) {
        this.collegeName = collegeName;
        this.branch = branch;
        this.cutoff = cutoff;
        this.requiredRank = requiredRank;
        this.probability = probability;
        this.message = String.format("You need rank %d or better for %.0f%% admission chance", 
                                     requiredRank, probability);
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
     * Gets the current cutoff rank.
     * 
     * @return The cutoff rank
     */
    public Integer getCutoff() { return cutoff; }
    
    /**
     * Sets the current cutoff rank.
     * 
     * @param cutoff The cutoff rank to set
     */
    public void setCutoff(Integer cutoff) { this.cutoff = cutoff; }
    
    /**
     * Gets the required rank for desired probability.
     * 
     * @return The required rank
     */
    public Integer getRequiredRank() { return requiredRank; }
    
    /**
     * Sets the required rank for desired probability.
     * 
     * @param requiredRank The required rank to set
     */
    public void setRequiredRank(Integer requiredRank) { this.requiredRank = requiredRank; }
    
    /**
     * Gets the desired admission probability.
     * 
     * @return The desired probability
     */
    public Double getProbability() { return probability; }
    
    /**
     * Sets the desired admission probability.
     * 
     * @param probability The desired probability to set
     */
    public void setProbability(Double probability) { this.probability = probability; }
    
    /**
     * Gets the human-readable message.
     * 
     * @return The message
     */
    public String getMessage() { return message; }
    
    /**
     * Sets the human-readable message.
     * 
     * @param message The message to set
     */
    public void setMessage(String message) { this.message = message; }
}