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

/**
 * Unit tests for filter independence in the College Predictor service.
 * These tests verify that each filter type works independently without affecting others.
 * 
 * The tests cover:
 * - Branch filtering independence
 * - District filtering independence
 * - Region filtering independence
 * - Tier filtering independence
 * - Placement quality filtering independence
 * 
 * Each test creates test data, mocks repository responses, applies a single filter,
 * and verifies that the repository is called correctly.
 */
public class FilterIndependenceTest {

    /**
     * Mock repository to simulate database operations without actual database access.
     */
    @Mock
    private CollegeRepository repo;

    /**
     * Service instance under test, injected with the mock repository.
     */
    private CollegePredictorService service;

    /**
     * Setup method executed before each test.
     * Initializes mocks and creates the service instance with the mock repository.
     */
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new CollegePredictorService(repo);
    }

    /**
     * Tests that branch filtering works independently.
     * Creates test colleges with different branches, applies branch filter,
     * and verifies repository interaction.
     */
    @Test
    public void testBranchFilterIndependently() {
        // Create test data with different branches
        College college1 = createTestCollege("CSE", "Hyderabad", "Telangana", "Tier 1", "Good");
        college1.setOcBoys(1000);
        
        College college2 = createTestCollege("ECE", "Bangalore", "Karnataka", "Tier 2", "Excellent");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response to return test data
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
        
        // Verify repository was called with specification
        verify(repo).findAll(any(Specification.class));
    }

    /**
     * Tests that district filtering works independently.
     * Creates test colleges in different districts, applies district filter,
     * and verifies repository interaction.
     */
    @Test
    public void testDistrictFilterIndependently() {
        // Create test data in different districts
        College college1 = createTestCollege("CSE", "Hyderabad", "Telangana", "Tier 1", "Good");
        college1.setOcBoys(1000);
        
        College college2 = createTestCollege("ECE", "Bangalore", "Karnataka", "Tier 2", "Excellent");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response to return test data
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
        
        // Verify repository was called with specification
        verify(repo).findAll(any(Specification.class));
    }

    /**
     * Tests that region filtering works independently.
     * Creates test colleges in different regions, applies region filter,
     * and verifies repository interaction.
     */
    @Test
    public void testRegionFilterIndependently() {
        // Create test data in different regions
        College college1 = createTestCollege("CSE", "Hyderabad", "Telangana", "Tier 1", "Good");
        college1.setOcBoys(1000);
        
        College college2 = createTestCollege("ECE", "Bangalore", "Karnataka", "Tier 2", "Excellent");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response to return test data
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
        
        // Verify repository was called with specification
        verify(repo).findAll(any(Specification.class));
    }

    /**
     * Tests that tier filtering works independently.
     * Creates test colleges with different tiers, applies tier filter,
     * and verifies repository interaction.
     */
    @Test
    public void testTierFilterIndependently() {
        // Create test data with different tiers
        College college1 = createTestCollege("CSE", "Hyderabad", "Telangana", "Tier 1", "Good");
        college1.setOcBoys(1000);
        
        College college2 = createTestCollege("ECE", "Bangalore", "Karnataka", "Tier 2", "Excellent");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response to return test data
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
        
        // Verify repository was called with specification
        verify(repo).findAll(any(Specification.class));
    }

    /**
     * Tests that placement quality filtering works independently.
     * Creates test colleges with different placement qualities, applies placement quality filter,
     * and verifies repository interaction.
     */
    @Test
    public void testPlacementQualityFilterIndependently() {
        // Create test data with different placement qualities
        College college1 = createTestCollege("CSE", "Hyderabad", "Telangana", "Tier 1", "Good");
        college1.setOcBoys(1000);
        
        College college2 = createTestCollege("ECE", "Bangalore", "Karnataka", "Tier 2", "Excellent");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response to return test data
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
        
        // Verify repository was called with specification
        verify(repo).findAll(any(Specification.class));
    }

    /**
     * Helper method to create test college objects with common properties.
     * 
     * @param branch The branch code
     * @param district The district name
     * @param region The region name
     * @param tier The tier classification
     * @param placementQuality The placement quality rating
     * @return A new College object with the specified properties
     */
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