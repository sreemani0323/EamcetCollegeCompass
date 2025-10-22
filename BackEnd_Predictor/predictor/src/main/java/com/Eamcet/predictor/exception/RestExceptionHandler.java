package com.Eamcet.predictor.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import java.util.Map;

@ControllerAdvice
public class RestExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(RestExceptionHandler.class);

    @ExceptionHandler(InvalidRequestException.class)
    public final ResponseEntity<?> handleInvalidRequestException(InvalidRequestException ex, WebRequest request) {
        log.warn("Invalid request: {}", ex.getMessage());
        Map<String, String> errorBody = Map.of("error", "Bad Request", "details", ex.getMessage());
        return new ResponseEntity<>(errorBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public final ResponseEntity<?> handleNoResourceFound(NoResourceFoundException ex, WebRequest request) {
        log.debug("Static resource not found: {}", ex.getMessage());
        Map<String, String> errorBody = Map.of(
            "error", "Not Found", 
            "details", "This is a REST API backend. Please use /api/predict-colleges endpoint or visit /ping for health check."
        );
        return new ResponseEntity<>(errorBody, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        log.error("An unexpected error occurred: {} - {}", ex.getClass().getName(), ex.getMessage(), ex);
        Map<String, String> errorBody = Map.of(
            "error", "Internal Server Error", 
            "details", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred. Please try again later.",
            "type", ex.getClass().getSimpleName()
        );
        return new ResponseEntity<>(errorBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}