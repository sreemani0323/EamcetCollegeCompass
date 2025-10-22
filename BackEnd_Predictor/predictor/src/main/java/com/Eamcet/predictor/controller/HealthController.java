package com.Eamcet.predictor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/ping")
    public String ping() {
        return "✅ App is working fine!";
    }

    // Handle HEAD and GET requests to root for Render health checks
    @RequestMapping(value = "/", method = {RequestMethod.GET, RequestMethod.HEAD})
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("College Predictor API is running. Use /api/predict-colleges or /ping");
    }
}
