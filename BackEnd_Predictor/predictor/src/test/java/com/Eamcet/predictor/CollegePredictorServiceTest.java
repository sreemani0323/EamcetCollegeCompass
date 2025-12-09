package com.Eamcet.predictor;

import com.Eamcet.predictor.service.CollegePredictorService;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

/**
 * Unit tests for the CollegePredictorService class.
 * These tests verify the correct behavior of category and gender combination logic
 * in the college predictor service.
 * 
 * The tests cover:
 * - Specific category and gender combinations (e.g., OC boys, OC girls)
 * - Cases where only category or gender is specified
 * - Default behavior when neither category nor gender is specified
 */
public class CollegePredictorServiceTest {

    /**
     * Service instance under test. Note that the repository dependency is set to null
     * since these tests only focus on the category/gender logic.
     */
    private final CollegePredictorService service = new CollegePredictorService(null);

    /**
     * Tests that when both category and gender are specified as "oc" and "boys",
     * the effective categories set contains only "oc_boys".
     */
    @Test
    public void testGetEffectiveCategories_OcBoys() {
        Set<String> categories = service.getEffectiveCategories("oc", "boys");
        assertEquals(1, categories.size());
        assertTrue(categories.contains("oc_boys"));
        assertFalse(categories.contains("oc_girls"));
    }

    /**
     * Tests that when both category and gender are specified as "oc" and "girls",
     * the effective categories set contains only "oc_girls".
     */
    @Test
    public void testGetEffectiveCategories_OcGirls() {
        Set<String> categories = service.getEffectiveCategories("oc", "girls");
        assertEquals(1, categories.size());
        assertTrue(categories.contains("oc_girls"));
        assertFalse(categories.contains("oc_boys"));
    }

    /**
     * Tests that when category is specified but gender is null,
     * the effective categories set contains both boys and girls variants.
     */
    @Test
    public void testGetEffectiveCategories_WithoutGender() {
        Set<String> categories = service.getEffectiveCategories("oc", null);
        assertEquals(2, categories.size());
        assertTrue(categories.contains("oc_boys"));
        assertTrue(categories.contains("oc_girls"));
    }

    /**
     * Tests that when category is null but gender is specified as "boys",
     * the effective categories set contains all categories with boys suffix.
     */
    @Test
    public void testGetEffectiveCategories_WithoutCategory() {
        Set<String> categories = service.getEffectiveCategories(null, "boys");
        // Should contain all categories with boys
        assertTrue(categories.contains("oc_boys"));
        assertTrue(categories.contains("sc_boys"));
        assertFalse(categories.contains("oc_girls"));
        assertFalse(categories.contains("sc_girls"));
    }
}