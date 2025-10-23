package com.Eamcet.predictor.dto;

public class ReverseCalculatorDto {
    private String collegeName;
    private String branch;
    private Integer cutoff;
    private Integer requiredRank;
    private Double probability;
    private String message;
    
    public ReverseCalculatorDto() {}
    
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
    
    // Getters and Setters
    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    
    public Integer getCutoff() { return cutoff; }
    public void setCutoff(Integer cutoff) { this.cutoff = cutoff; }
    
    public Integer getRequiredRank() { return requiredRank; }
    public void setRequiredRank(Integer requiredRank) { this.requiredRank = requiredRank; }
    
    public Double getProbability() { return probability; }
    public void setProbability(Double probability) { this.probability = probability; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
