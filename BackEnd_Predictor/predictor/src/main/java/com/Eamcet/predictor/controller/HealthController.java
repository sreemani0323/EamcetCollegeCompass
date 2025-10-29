package com.Eamcet.predictor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Health check controller for the College Predictor application.
 * Provides simple endpoints to verify that the application is running and responsive.
 * 
 * This controller is primarily used for:
 * - Application health monitoring (e.g., by Render.com or other hosting platforms)
 * - Quick verification that the API is accessible
 * - Basic connectivity testing
 */
@RestController
public class HealthController {

    /**
     * Simple health check endpoint that returns a success message.
     * Used by monitoring systems to verify application availability.
     * 
     * @return A success message indicating the application is working
     */
    @GetMapping("/ping")
    public String ping() {
        return "✅ App is working fine!";
    }

    /**
     * Root endpoint that handles both GET and HEAD requests.
     * Used for Render health checks and provides basic API information.
     * 
     * @return ResponseEntity with a message about available API endpoints
     */
    // Handle HEAD and GET requests to root for Render health checks
    @RequestMapping(value = "/", method = {RequestMethod.GET, RequestMethod.HEAD})
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("College Predictor API is running. Use /api/predict-colleges or /ping");
    }
}