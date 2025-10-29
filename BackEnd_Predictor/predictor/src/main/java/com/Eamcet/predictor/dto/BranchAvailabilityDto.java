package com.Eamcet.predictor.dto;

/**
 * Data Transfer Object for branch availability information.
 * Contains information about colleges that offer a specific branch.
 * 
 * This DTO is used to show which colleges offer a particular engineering branch.
 */
public class BranchAvailabilityDto {
    /**
     * Institution code uniquely identifying the college.
     */
    private String instcode;
    
    /**
     * Full name of the college/institution.
     */
    private String collegeName;
    
    /**
     * District where the college is located.
     */
    private String district;
    
    /**
     * Region where the college is located.
     */
    private String region;
    
    /**
     * Tier classification of the college.
     */
    private String tier;
    
    /**
     * Default constructor required for JSON serialization.
     */
    public BranchAvailabilityDto() {}
    
    /**
     * Constructor for creating a BranchAvailabilityDto with all data.
     * 
     * @param instcode Institution code of the college
     * @param collegeName Name of the college
     * @param district District where the college is located
     * @param region Region where the college is located
     * @param tier Tier classification of the college
     */
    public BranchAvailabilityDto(String instcode, String collegeName, String district, 
                                String region, String tier) {
        this.instcode = instcode;
        this.collegeName = collegeName;
        this.district = district;
        this.region = region;
        this.tier = tier;
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
     * Gets the tier classification.
     * 
     * @return The tier
     */
    public String getTier() { return tier; }
    
    /**
     * Sets the tier classification.
     * 
     * @param tier The tier to set
     */
    public void setTier(String tier) { this.tier = tier; }
}