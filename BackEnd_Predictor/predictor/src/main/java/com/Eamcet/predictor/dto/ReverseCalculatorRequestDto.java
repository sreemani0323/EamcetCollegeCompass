package com.Eamcet.predictor.dto;

public class ReverseCalculatorRequestDto {
    private String instcode;
    private String branch;
    private String category;
    private Double desiredProbability;
    
    public ReverseCalculatorRequestDto() {}
    
    // Getters and Setters
    public String getInstcode() { return instcode; }
    public void setInstcode(String instcode) { this.instcode = instcode; }
    
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Double getDesiredProbability() { return desiredProbability; }
    public void setDesiredProbability(Double desiredProbability) { this.desiredProbability = desiredProbability; }
}
