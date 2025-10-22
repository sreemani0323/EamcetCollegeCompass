package com.Eamcet.predictor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;

@SpringBootApplication
public class PredictorApplication {
    
    private static final Logger log = LoggerFactory.getLogger(PredictorApplication.class);
    
    @Value("${spring.datasource.password:}")
    private String dbPassword;
    
    public static void main(String[] args) {
        SpringApplication.run(PredictorApplication.class, args);
    }
    
    @PostConstruct
    public void validateConfiguration() {
        if (dbPassword == null || dbPassword.trim().isEmpty()) {
            log.error("Database password is not configured. Please set DB_PASSWORD environment variable.");
            throw new IllegalStateException("DB_PASSWORD environment variable is required but not set");
        }
        log.info("Application configuration validated successfully");
    }
}
