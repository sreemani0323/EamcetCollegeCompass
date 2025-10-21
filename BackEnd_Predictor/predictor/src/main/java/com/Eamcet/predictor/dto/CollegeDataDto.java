package com.Eamcet.predictor.dto;

import com.Eamcet.predictor.model.RawTable;

public class CollegeDataDto {

    private String instcode;
    private String name;
    private String place;
    private String district;
    private String region;
    private String branch;
    private String tier;
    private Double averagePackage;
    private Double highestPackage;
    private String placementDriveQuality;

    // Constructor to easily convert from the database entity
    public CollegeDataDto(RawTable rawTable) {
        this.instcode = rawTable.getInstcode();
        this.name = rawTable.getInstitution_name();
        this.place = rawTable.getPlace();
        this.district = rawTable.getDistrict();
        this.region = rawTable.getRegion();
        this.branch = rawTable.getBranchCode();
        this.tier = rawTable.getTier();
        this.averagePackage = rawTable.getAveragePackage();
        this.highestPackage = rawTable.getHighestPackage();
        this.placementDriveQuality = rawTable.getPlacementDriveQuality();
    }

    // Getters for all fields
    public String getInstcode() { return instcode; }
    public String getName() { return name; }
    public String getPlace() { return place; }
    public String getDistrict() { return district; }
    public String getRegion() { return region; }
    public String getBranch() { return branch; }
    public String getTier() { return tier; }
    public Double getAveragePackage() { return averagePackage; }
    public Double getHighestPackage() { return highestPackage; }
    public String getPlacementDriveQuality() { return placementDriveQuality; }
}