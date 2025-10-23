package com.Eamcet.predictor.dto;

import java.util.List;

public class RecommendationRequestDto {
    private Integer rank;
    private String category;
    private String gender;
    private String branch;
    private List<String> preferredRegions;
    
    public RecommendationRequestDto() {}
    
    // Getters and Setters
    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    
    public List<String> getPreferredRegions() { return preferredRegions; }
    public void setPreferredRegions(List<String> preferredRegions) { this.preferredRegions = preferredRegions; }
}
