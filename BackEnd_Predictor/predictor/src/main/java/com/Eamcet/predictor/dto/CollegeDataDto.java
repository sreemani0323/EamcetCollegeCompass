package com.Eamcet.predictor.dto;

import com.Eamcet.predictor.model.College;

/**
 * Data Transfer Object for basic college information.
 * Used to transfer essential college data between layers and to the frontend.
 * This DTO contains a subset of college information focused on identification
 * and basic details without cutoff or probability data.
 */
public class CollegeDataDto {

    /**
     * Institution code uniquely identifying the college.
     */
    private String instcode;
    
    /**
     * Full name of the institution.
     */
    private String name;
    
    /**
     * Place/locality where the college is located.
     */
    private String place;
    
    /**
     * District where the college is located.
     */
    private String district;
    
    /**
     * Region where the college is located.
     */
    private String region;
    
    /**
     * Division information of the college.
     */
    private String division;
    
    /**
     * Branch code representing the engineering branch.
     */
    private String branch;
    
    /**
     * Tier classification of the college.
     */
    private String tier;
    
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
    private String placementDriveQuality;

    /**
     * Constructor that creates a CollegeDataDto from a College entity.
     * 
     * @param college The college entity to extract data from
     */
    public CollegeDataDto(College college) {
        this.instcode = college.getInstcode();
        this.name = college.getInstitution_name();
        this.place = college.getPlace();
        this.district = college.getDistrict();
        this.region = college.getRegion();
        this.division = college.getDivision();
        this.branch = college.getBranchCode();
        this.tier = college.getTier();
        this.averagePackage = college.getAveragePackage();
        this.highestPackage = college.getHighestPackage();
        this.placementDriveQuality = college.getPlacementDriveQuality();
    }

    /**
     * Gets the institution code.
     * 
     * @return The institution code
     */
    public String getInstcode() { return instcode; }
    
    /**
     * Gets the institution name.
     * 
     * @return The institution name
     */
    public String getName() { return name; }
    
    /**
     * Gets the place/locality.
     * 
     * @return The place
     */
    public String getPlace() { return place; }
    
    /**
     * Gets the district.
     * 
     * @return The district
     */
    public String getDistrict() { return district; }
    
    /**
     * Gets the region.
     * 
     * @return The region
     */
    public String getRegion() { return region; }
    
    /**
     * Gets the division.
     * 
     * @return The division
     */
    public String getDivision() { return division; }
    
    /**
     * Gets the branch code.
     * 
     * @return The branch code
     */
    public String getBranch() { return branch; }
    
    /**
     * Gets the tier classification.
     * 
     * @return The tier
     */
    public String getTier() { return tier; }
    
    /**
     * Gets the average package.
     * 
     * @return The average package
     */
    public Double getAveragePackage() { return averagePackage; }
    
    /**
     * Gets the highest package.
     * 
     * @return The highest package
     */
    public Double getHighestPackage() { return highestPackage; }
    
    /**
     * Gets the placement drive quality.
     * 
     * @return The placement drive quality
     */
    public String getPlacementDriveQuality() { return placementDriveQuality; }
}