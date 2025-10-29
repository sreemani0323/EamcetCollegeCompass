package com.Eamcet.predictor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;

/**
 * Main application class for the College Predictor Spring Boot application.
 * This class bootstraps the Spring Boot application and performs initial configuration validation.
 * 
 * The application provides RESTful APIs for predicting college admissions based on EAMCET ranks,
 * with features for analytics, branch comparison, and reverse calculation.
 */
@SpringBootApplication
public class PredictorApplication {
    
    private static final Logger log = LoggerFactory.getLogger(PredictorApplication.class);
    
    /**
     * Database password injected from environment variables.
     * Used to validate that the application has proper database configuration.
     */
    @Value("${spring.datasource.password:}")
    private String dbPassword;
    
    /**
     * Main entry point for the Spring Boot application.
     * Initializes and starts the Spring application context.
     * 
     * @param args Command line arguments passed to the application
     */
    public static void main(String[] args) {
        SpringApplication.run(PredictorApplication.class, args);
    }
    
    /**
     * Validates application configuration after dependency injection.
     * This method is called after the Spring container has set all properties.
     * It ensures that critical configuration like database password is properly set.
     * 
     * @throws IllegalStateException if DB_PASSWORD environment variable is not set
     */
    @PostConstruct
    public void validateConfiguration() {
        if (dbPassword == null || dbPassword.trim().isEmpty()) {
            log.error("Database password is not configured. Please set DB_PASSWORD environment variable.");
            throw new IllegalStateException("DB_PASSWORD environment variable is required but not set");
        }
        log.info("Application configuration validated successfully");
    }
}