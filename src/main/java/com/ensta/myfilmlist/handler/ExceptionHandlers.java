package com.ensta.myfilmlist.handler;

// Imports Spring et DTOs nécessaires
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

@RestControllerAdvice // Pour que cette classe gère les exceptions de tous les contrôleurs
public class ExceptionHandlers {
    
    /**
     * Intercepte les ControllerException (ex: Realisateur non trouvé lors de la création).
     * Renvoie le statut HTTP 400 (Bad Request) avec le message d'erreur.
     */
    @ExceptionHandler(ControllerException.class)
    public ResponseEntity<String> handleControllerException(
            ControllerException exception, WebRequest webRequest) {
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }
    /**
     * Intercepte les BindException (erreurs de validation des paramètres @Valid).
     * Renvoie le statut HTTP 400 (Bad Request) avec la liste des erreurs de validation.
     */
    @ExceptionHandler(BindException.class) // Gère les erreurs de validation comme @NotBlank, @Min, etc.
    public ResponseEntity<Map<String, String>> handleValidationExceptions(BindException ex) {
        Map<String, String> errors = new HashMap<>();
        
        // Parcourt toutes les erreurs de champ et les ajoute à la map
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        // Renvoie le statut HTTP 400 (Bad Request) avec les messages d'erreur dans le corps
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}