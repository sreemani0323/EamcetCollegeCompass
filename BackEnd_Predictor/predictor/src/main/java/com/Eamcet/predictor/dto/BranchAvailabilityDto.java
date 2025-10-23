package com.Eamcet.predictor.dto;

public class BranchAvailabilityDto {
    private String instcode;
    private String collegeName;
    private String district;
    private String region;
    private String tier;
    
    public BranchAvailabilityDto() {}
    
    public BranchAvailabilityDto(String instcode, String collegeName, String district, 
                                String region, String tier) {
        this.instcode = instcode;
        this.collegeName = collegeName;
        this.district = district;
        this.region = region;
        this.tier = tier;
    }
    
    // Getters and Setters
    public String getInstcode() { return instcode; }
    public void setInstcode(String instcode) { this.instcode = instcode; }
    
    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
}
