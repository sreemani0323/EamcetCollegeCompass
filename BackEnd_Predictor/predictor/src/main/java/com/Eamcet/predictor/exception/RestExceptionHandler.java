package com.Eamcet.predictor.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.io.IOException;
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

    @ExceptionHandler(NoHandlerFoundException.class)
    public final ResponseEntity<?> handleNoHandlerFound(NoHandlerFoundException ex, WebRequest request) {
        log.debug("No handler found for {} {}", ex.getHttpMethod(), ex.getRequestURL());
        Map<String, String> errorBody = Map.of(
            "error", "Not Found", 
            "details", "This is a REST API backend. Available endpoints: /ping, /api/predict-colleges"
        );
        return new ResponseEntity<>(errorBody, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AsyncRequestNotUsableException.class)
    public final ResponseEntity<?> handleAsyncRequestNotUsable(AsyncRequestNotUsableException ex, WebRequest request) {
        // This typically happens when client disconnects before response is complete
        // Log at debug level since it's usually not an application error
        log.debug("Client disconnected before response could be sent: {}", ex.getMessage());
        // Don't send a response since the connection is already broken
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
    }

    @ExceptionHandler(IOException.class)
    public final ResponseEntity<?> handleIOException(IOException ex, WebRequest request) {
        // Handle broken pipe and other IO exceptions gracefully
        // These typically happen when client disconnects
        log.debug("IO Exception (likely client disconnect): {}", ex.getMessage());
        // Don't send a response since the connection is already broken
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
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