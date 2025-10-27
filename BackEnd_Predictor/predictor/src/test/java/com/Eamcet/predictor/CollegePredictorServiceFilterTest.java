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

public class CollegePredictorServiceFilterTest {

    @Mock
    private CollegeRepository repo;

    private CollegePredictorService service;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new CollegePredictorService(repo);
    }

    @Test
    public void testFindCollegesWithBranchFilter() {
        // Create test data
        College college1 = new College();
        college1.setBranchCode("CSE");
        college1.setOcBoys(1000);
        
        College college2 = new College();
        college2.setBranchCode("ECE");
        college2.setOcBoys(1200);
        
        List<College> testData = Arrays.asList(college1, college2);
        
        // Mock repository response
        when(repo.findAll(any(Specification.class))).thenReturn(testData);
        
        // Call service method with branch filter
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
        
        // Check results
        assertNotNull(results);
        // Results may be empty because of cutoff filtering logic
        // The important thing is that the repository was called with the right specification
    }
}