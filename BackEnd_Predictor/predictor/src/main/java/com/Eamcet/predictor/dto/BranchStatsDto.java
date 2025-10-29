package com.Eamcet.predictor.dto;

/**
 * Data Transfer Object for branch statistics.
 * Contains statistical information about colleges offering a specific branch,
 * including count, average, maximum, and minimum package data.
 * 
 * This DTO is used to provide detailed analytics for individual branches.
 */
public class BranchStatsDto {
    /**
     * The branch code this statistics apply to.
     */
    private String branch;
    
    /**
     * Total number of colleges offering this branch.
     */
    private Integer totalColleges;
    
    /**
     * Average package offered for this branch across all colleges.
     */
    private Double avgPackage;
    
    /**
     * Maximum package offered for this branch across all colleges.
     */
    private Double maxPackage;
    
    /**
     * Minimum package offered for this branch across all colleges.
     */
    private Double minPackage;
    
    /**
     * Default constructor required for JSON serialization.
     */
    public BranchStatsDto() {}
    
    /**
     * Constructor for creating a BranchStatsDto with all data.
     * 
     * @param branch The branch code
     * @param totalColleges Total number of colleges offering this branch
     * @param avgPackage Average package for this branch
     * @param maxPackage Maximum package for this branch
     * @param minPackage Minimum package for this branch
     */
    public BranchStatsDto(String branch, Integer totalColleges, Double avgPackage, 
                         Double maxPackage, Double minPackage) {
        this.branch = branch;
        this.totalColleges = totalColleges;
        this.avgPackage = avgPackage;
        this.maxPackage = maxPackage;
        this.minPackage = minPackage;
    }
    
    // Getter and setter methods
    
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
     * Gets the total number of colleges offering this branch.
     * 
     * @return The total colleges count
     */
    public Integer getTotalColleges() { return totalColleges; }
    
    /**
     * Sets the total number of colleges offering this branch.
     * 
     * @param totalColleges The total colleges count to set
     */
    public void setTotalColleges(Integer totalColleges) { this.totalColleges = totalColleges; }
    
    /**
     * Gets the average package for this branch.
     * 
     * @return The average package
     */
    public Double getAvgPackage() { return avgPackage; }
    
    /**
     * Sets the average package for this branch.
     * 
     * @param avgPackage The average package to set
     */
    public void setAvgPackage(Double avgPackage) { this.avgPackage = avgPackage; }
    
    /**
     * Gets the maximum package for this branch.
     * 
     * @return The maximum package
     */
    public Double getMaxPackage() { return maxPackage; }
    
    /**
     * Sets the maximum package for this branch.
     * 
     * @param maxPackage The maximum package to set
     */
    public void setMaxPackage(Double maxPackage) { this.maxPackage = maxPackage; }
    
    /**
     * Gets the minimum package for this branch.
     * 
     * @return The minimum package
     */
    public Double getMinPackage() { return minPackage; }
    
    /**
     * Sets the minimum package for this branch.
     * 
     * @param minPackage The minimum package to set
     */
    public void setMinPackage(Double minPackage) { this.minPackage = minPackage; }
}