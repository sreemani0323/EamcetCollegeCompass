package com.Eamcet.predictor.dto;

import com.Eamcet.predictor.model.College;

public class CollegeDataDto {

    private String instcode;
    private String name;
    private String place;
    private String district;
    private String region;
    private String division; // Add gender/division information
    private String branch;
    private String tier;
    private Double averagePackage;
    private Double highestPackage;
    private String placementDriveQuality;

    // Constructor to easily convert from the database entity
    public CollegeDataDto(College college) {
        this.instcode = college.getInstcode();
        this.name = college.getInstitution_name();
        this.place = college.getPlace();
        this.district = college.getDistrict();
        this.region = college.getRegion();
        this.division = college.getDivision(); // Include division (gender info)
        this.branch = college.getBranchCode();
        this.tier = college.getTier();
        this.averagePackage = college.getAveragePackage();
        this.highestPackage = college.getHighestPackage();
        this.placementDriveQuality = college.getPlacementDriveQuality();
    }

    // Getters for all fields
    public String getInstcode() { return instcode; }
    public String getName() { return name; }
    public String getPlace() { return place; }
    public String getDistrict() { return district; }
    public String getRegion() { return region; }
    public String getDivision() { return division; }
    public String getBranch() { return branch; }
    public String getTier() { return tier; }
    public Double getAveragePackage() { return averagePackage; }
    public Double getHighestPackage() { return highestPackage; }
    public String getPlacementDriveQuality() { return placementDriveQuality; }
}