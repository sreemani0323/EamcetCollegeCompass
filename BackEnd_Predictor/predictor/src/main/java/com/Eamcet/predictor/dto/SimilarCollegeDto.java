package com.Eamcet.predictor.dto;

public class SimilarCollegeDto {
    private String instcode;
    private String collegeName;
    private String branch;
    private Integer cutoff;
    private Double averagePackage;
    private String tier;
    private Double similarityScore;
    
    public SimilarCollegeDto() {}
    
    public SimilarCollegeDto(String instcode, String collegeName, String branch, Integer cutoff,
                            Double averagePackage, String tier, Double similarityScore) {
        this.instcode = instcode;
        this.collegeName = collegeName;
        this.branch = branch;
        this.cutoff = cutoff;
        this.averagePackage = averagePackage;
        this.tier = tier;
        this.similarityScore = similarityScore;
    }
    
    // Getters and Setters
    public String getInstcode() { return instcode; }
    public void setInstcode(String instcode) { this.instcode = instcode; }
    
    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    
    public Integer getCutoff() { return cutoff; }
    public void setCutoff(Integer cutoff) { this.cutoff = cutoff; }
    
    public Double getAveragePackage() { return averagePackage; }
    public void setAveragePackage(Double averagePackage) { this.averagePackage = averagePackage; }
    
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    
    public Double getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(Double similarityScore) { this.similarityScore = similarityScore; }
}
