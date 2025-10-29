package com.Eamcet.predictor.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception for invalid request parameters or data.
 * This exception is thrown when the client sends malformed or invalid data
 * in API requests, and it automatically results in a 400 Bad Request response.
 * 
 * Examples of when this exception is thrown:
 * - Invalid rank values (negative numbers, non-numeric input)
 * - Missing required parameters
 * - Invalid category or gender combinations
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidRequestException extends RuntimeException {
    /**
     * Constructs a new InvalidRequestException with the specified detail message.
     * 
     * @param message The detail message explaining why the request is invalid
     */
    public InvalidRequestException(String message) {
        super(message);
    }
}