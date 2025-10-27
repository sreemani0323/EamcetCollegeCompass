package com.Eamcet.predictor;

import com.Eamcet.predictor.service.CollegePredictorService;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

public class CollegePredictorServiceTest {

    private final CollegePredictorService service = new CollegePredictorService(null);

    @Test
    public void testGetEffectiveCategories_OcBoys() {
        Set<String> categories = service.getEffectiveCategories("oc", "boys");
        assertEquals(1, categories.size());
        assertTrue(categories.contains("oc_boys"));
        assertFalse(categories.contains("oc_girls"));
    }

    @Test
    public void testGetEffectiveCategories_OcGirls() {
        Set<String> categories = service.getEffectiveCategories("oc", "girls");
        assertEquals(1, categories.size());
        assertTrue(categories.contains("oc_girls"));
        assertFalse(categories.contains("oc_boys"));
    }

    @Test
    public void testGetEffectiveCategories_WithoutGender() {
        Set<String> categories = service.getEffectiveCategories("oc", null);
        assertEquals(2, categories.size());
        assertTrue(categories.contains("oc_boys"));
        assertTrue(categories.contains("oc_girls"));
    }

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