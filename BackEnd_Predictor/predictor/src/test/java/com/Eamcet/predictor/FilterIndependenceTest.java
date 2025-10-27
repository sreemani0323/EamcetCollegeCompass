package com.Eamcet.predictor;

import com.Eamcet.predictor.model.College;
import com.Eamcet.predictor.repository.CollegeRepository;
import com.Eamcet.predictor.service.CollegePredictorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class FilterIndependenceTest {

    @Mock
    private CollegeRepository repo;

    private CollegePredictorService service;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new CollegePredictorService(repo);
    }

    @Test
    public void testBranchFilterIndependently() {
        // Create test data
        College college1 = createTestCollege("CSE", "Hyderabad", "Telangana", "Tier 1", "Good");
        college1.setOcBoys(1000);
        
        College college2 = createTestCollege("ECE", "Bangalore", "Karnataka", "Tier 2", "Excellent");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response
        when(repo.findAll(any(Specification.class))).thenReturn(testData);
        
        // Test branch filter only
        List<CollegePredictorService.CollegeResult> results = service.findColleges(
            null, // rank
            Arrays.asList("CSE"), // branches
            "oc", // category
            null, // districts
            null, // regions
            null, // tiers
            null, // placementQualities
            "boys" // gender
        );
        
        // Verify repository was called
        verify(repo).findAll(any(Specification.class));
    }

    @Test
    public void testDistrictFilterIndependently() {
        // Create test data
        College college1 = createTestCollege("CSE", "Hyderabad", "Telangana", "Tier 1", "Good");
        college1.setOcBoys(1000);
        
        College college2 = createTestCollege("ECE", "Bangalore", "Karnataka", "Tier 2", "Excellent");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response
        when(repo.findAll(any(Specification.class))).thenReturn(testData);
        
        // Test district filter only
        List<CollegePredictorService.CollegeResult> results = service.findColleges(
            null, // rank
            null, // branches
            "oc", // category
            Arrays.asList("Hyderabad"), // districts
            null, // regions
            null, // tiers
            null, // placementQualities
            "boys" // gender
        );
        
        // Verify repository was called
        verify(repo).findAll(any(Specification.class));
    }

    @Test
    public void testRegionFilterIndependently() {
        // Create test data
        College college1 = createTestCollege("CSE", "Hyderabad", "Telangana", "Tier 1", "Good");
        college1.setOcBoys(1000);
        
        College college2 = createTestCollege("ECE", "Bangalore", "Karnataka", "Tier 2", "Excellent");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response
        when(repo.findAll(any(Specification.class))).thenReturn(testData);
        
        // Test region filter only
        List<CollegePredictorService.CollegeResult> results = service.findColleges(
            null, // rank
            null, // branches
            "oc", // category
            null, // districts
            Arrays.asList("Telangana"), // regions
            null, // tiers
            null, // placementQualities
            "boys" // gender
        );
        
        // Verify repository was called
        verify(repo).findAll(any(Specification.class));
    }

    @Test
    public void testTierFilterIndependently() {
        // Create test data
        College college1 = createTestCollege("CSE", "Hyderabad", "Telangana", "Tier 1", "Good");
        college1.setOcBoys(1000);
        
        College college2 = createTestCollege("ECE", "Bangalore", "Karnataka", "Tier 2", "Excellent");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response
        when(repo.findAll(any(Specification.class))).thenReturn(testData);
        
        // Test tier filter only
        List<CollegePredictorService.CollegeResult> results = service.findColleges(
            null, // rank
            null, // branches
            "oc", // category
            null, // districts
            null, // regions
            Arrays.asList("Tier 1"), // tiers
            null, // placementQualities
            "boys" // gender
        );
        
        // Verify repository was called
        verify(repo).findAll(any(Specification.class));
    }

    @Test
    public void testPlacementQualityFilterIndependently() {
        // Create test data
        College college1 = createTestCollege("CSE", "Hyderabad", "Telangana", "Tier 1", "Good");
        college1.setOcBoys(1000);
        
        College college2 = createTestCollege("ECE", "Bangalore", "Karnataka", "Tier 2", "Excellent");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response
        when(repo.findAll(any(Specification.class))).thenReturn(testData);
        
        // Test placement quality filter only
        List<CollegePredictorService.CollegeResult> results = service.findColleges(
            null, // rank
            null, // branches
            "oc", // category
            null, // districts
            null, // regions
            null, // tiers
            Arrays.asList("Good"), // placementQualities
            "boys" // gender
        );
        
        // Verify repository was called
        verify(repo).findAll(any(Specification.class));
    }

    private College createTestCollege(String branch, String district, String region, String tier, String placementQuality) {
        College college = new College();
        college.setBranchCode(branch);
        college.setDistrict(district);
        college.setRegion(region);
        college.setTier(tier);
        college.setPlacementDriveQuality(placementQuality);
        return college;
    }
}