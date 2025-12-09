package com.Eamcet.predictor.dto;

import java.util.Map;

/**
 * Data Transfer Object for cutoff distribution information.
 * Contains detailed cutoff data for a specific college and branch across all categories,
 * along with statistical summaries.
 * 
 * This DTO is used to display cutoff distributions and statistics for detailed analysis.
 */
public class CutoffDistributionDto {
    /**
     * Name of the college/institution.
     */
    private String collegeName;
    
    /**
     * Branch code for which the cutoff data applies.
     */
    private String branch;
    
    /**
     * Map of category names to cutoff ranks for that category.
     */
    private Map<String, Integer> cutoffByCategory;
    
    /**
     * Minimum cutoff rank across all categories.
     */
    private Integer minCutoff;
    
    /**
     * Maximum cutoff rank across all categories.
     */
    private Integer maxCutoff;
    
    /**
     * Average cutoff rank across all categories.
     */
    private Integer avgCutoff;
    
    /**
     * Default constructor required for JSON serialization.
     */
    public CutoffDistributionDto() {}
    
    /**
     * Constructor for creating a CutoffDistributionDto with all data.
     * 
     * @param collegeName Name of the college
     * @param branch Branch code
     * @param cutoffByCategory Map of cutoff ranks by category
     * @param minCutoff Minimum cutoff rank
     * @param maxCutoff Maximum cutoff rank
     * @param avgCutoff Average cutoff rank
     */
    public CutoffDistributionDto(String collegeName, String branch, Map<String, Integer> cutoffByCategory,
                                Integer minCutoff, Integer maxCutoff, Integer avgCutoff) {
        this.collegeName = collegeName;
        this.branch = branch;
        this.cutoffByCategory = cutoffByCategory;
        this.minCutoff = minCutoff;
        this.maxCutoff = maxCutoff;
        this.avgCutoff = avgCutoff;
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
     * Gets the map of cutoff ranks by category.
     * 
     * @return Map of category names to cutoff ranks
     */
    public Map<String, Integer> getCutoffByCategory() { return cutoffByCategory; }
    
    /**
     * Sets the map of cutoff ranks by category.
     * 
     * @param cutoffByCategory Map of category names to cutoff ranks
     */
    public void setCutoffByCategory(Map<String, Integer> cutoffByCategory) { this.cutoffByCategory = cutoffByCategory; }
    
    /**
     * Gets the minimum cutoff rank.
     * 
     * @return The minimum cutoff rank
     */
    public Integer getMinCutoff() { return minCutoff; }
    
    /**
     * Sets the minimum cutoff rank.
     * 
     * @param minCutoff The minimum cutoff rank to set
     */
    public void setMinCutoff(Integer minCutoff) { this.minCutoff = minCutoff; }
    
    /**
     * Gets the maximum cutoff rank.
     * 
     * @return The maximum cutoff rank
     */
    public Integer getMaxCutoff() { return maxCutoff; }
    
    /**
     * Sets the maximum cutoff rank.
     * 
     * @param maxCutoff The maximum cutoff rank to set
     */
    public void setMaxCutoff(Integer maxCutoff) { this.maxCutoff = maxCutoff; }
    
    /**
     * Gets the average cutoff rank.
     * 
     * @return The average cutoff rank
     */
    public Integer getAvgCutoff() { return avgCutoff; }
    
    /**
     * Sets the average cutoff rank.
     * 
     * @param avgCutoff The average cutoff rank to set
     */
    public void setAvgCutoff(Integer avgCutoff) { this.avgCutoff = avgCutoff; }
}