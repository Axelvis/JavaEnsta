package com.ensta.myfilmlist.handler;

import com.ensta.myfilmlist.exception.ControllerException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ExceptionHandlers {
    

    @ExceptionHandler(ControllerException.class)
    public ResponseEntity<String> handleControllerException(
            ControllerException exception, WebRequest webRequest) {
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(BindException ex) {
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
