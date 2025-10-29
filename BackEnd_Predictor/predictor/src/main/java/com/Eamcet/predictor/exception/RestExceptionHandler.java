package com.Eamcet.predictor.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.io.IOException;
import java.util.Map;

/**
 * Global exception handler for the College Predictor REST API.
 * This class handles various types of exceptions that can occur during API requests
 * and provides appropriate error responses to clients.
 * 
 * The handler covers:
 * - Custom application exceptions (InvalidRequestException)
 * - Spring framework exceptions (NoHandlerFoundException, NoResourceFoundException)
 * - Network/IO exceptions (AsyncRequestNotUsableException, IOException)
 * - Unexpected exceptions (Exception)
 */
@ControllerAdvice
public class RestExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(RestExceptionHandler.class);

    /**
     * Handles InvalidRequestException by returning a 400 Bad Request response.
     * This occurs when clients send invalid data in their requests.
     * 
     * @param ex The InvalidRequestException that was thrown
     * @param request The WebRequest that caused the exception
     * @return ResponseEntity with error details and 400 status
     */
    @ExceptionHandler(InvalidRequestException.class)
    public final ResponseEntity<?> handleInvalidRequestException(InvalidRequestException ex, WebRequest request) {
        log.warn("Invalid request: {}", ex.getMessage());
        Map<String, String> errorBody = Map.of("error", "Bad Request", "details", ex.getMessage());
        return new ResponseEntity<>(errorBody, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles NoResourceFoundException by returning a 404 Not Found response.
     * This occurs when clients request static resources that don't exist.
     * 
     * @param ex The NoResourceFoundException that was thrown
     * @param request The WebRequest that caused the exception
     * @return ResponseEntity with error details and 404 status
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public final ResponseEntity<?> handleNoResourceFound(NoResourceFoundException ex, WebRequest request) {
        log.debug("Static resource not found: {}", ex.getMessage());
        Map<String, String> errorBody = Map.of(
            "error", "Not Found", 
            "details", "This is a REST API backend. Please use /api/predict-colleges endpoint or visit /ping for health check."
        );
        return new ResponseEntity<>(errorBody, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles NoHandlerFoundException by returning a 404 Not Found response.
     * This occurs when clients request endpoints that don't exist.
     * 
     * @param ex The NoHandlerFoundException that was thrown
     * @param request The WebRequest that caused the exception
     * @return ResponseEntity with error details and 404 status
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public final ResponseEntity<?> handleNoHandlerFound(NoHandlerFoundException ex, WebRequest request) {
        log.debug("No handler found for {} {}", ex.getHttpMethod(), ex.getRequestURL());
        Map<String, String> errorBody = Map.of(
            "error", "Not Found", 
            "details", "This is a REST API backend. Available endpoints: /ping, /api/predict-colleges"
        );
        return new ResponseEntity<>(errorBody, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles AsyncRequestNotUsableException by returning a 503 Service Unavailable response.
     * This typically occurs when clients disconnect before the response is complete.
     * 
     * @param ex The AsyncRequestNotUsableException that was thrown
     * @param request The WebRequest that caused the exception
     * @return ResponseEntity with 503 status (no body since connection is broken)
     */
    @ExceptionHandler(AsyncRequestNotUsableException.class)
    public final ResponseEntity<?> handleAsyncRequestNotUsable(AsyncRequestNotUsableException ex, WebRequest request) {
        // This typically happens when client disconnects before response is complete
        // Log at debug level since it's usually not an application error
        log.debug("Client disconnected before response could be sent: {}", ex.getMessage());
        // Don't send a response since the connection is already broken
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
    }

    /**
     * Handles IOException by returning a 503 Service Unavailable response.
     * This typically occurs when clients disconnect during IO operations.
     * 
     * @param ex The IOException that was thrown
     * @param request The WebRequest that caused the exception
     * @return ResponseEntity with 503 status (no body since connection is broken)
     */
    @ExceptionHandler(IOException.class)
    public final ResponseEntity<?> handleIOException(IOException ex, WebRequest request) {
        // Handle broken pipe and other IO exceptions gracefully
        // These typically happen when client disconnects
        log.debug("IO Exception (likely client disconnect): {}", ex.getMessage());
        // Don't send a response since the connection is already broken
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
    }

    /**
     * Handles all other unexpected exceptions by returning a 500 Internal Server Error response.
     * This is a catch-all handler for any unhandled exceptions in the application.
     * 
     * @param ex The Exception that was thrown
     * @param request The WebRequest that caused the exception
     * @return ResponseEntity with error details and 500 status
     */
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