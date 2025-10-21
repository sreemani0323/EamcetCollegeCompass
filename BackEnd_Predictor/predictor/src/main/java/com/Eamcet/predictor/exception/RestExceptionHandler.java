package com.Eamcet.predictor.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import java.util.Map;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(InvalidRequestException.class)
    public final ResponseEntity<?> handleInvalidRequestException(InvalidRequestException ex, WebRequest request) {
        Map<String, String> errorBody = Map.of("error", "Bad Request", "details", ex.getMessage());
        return new ResponseEntity<>(errorBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        // It's a good practice to log the exception here
        // log.error("An unexpected error occurred", ex);
        Map<String, String> errorBody = Map.of("error", "Internal Server Error", "details", "An unexpected error occurred. Please try again later.");
        return new ResponseEntity<>(errorBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}