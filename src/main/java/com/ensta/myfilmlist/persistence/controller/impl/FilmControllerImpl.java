package com.ensta.myfilmlist.persistence.controller.impl;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; 
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus; 
import com.ensta.myfilmlist.form.FilmForm; 
import org.springframework.http.HttpStatus;

import com.ensta.myfilmlist.dto.FilmDTO;
import com.ensta.myfilmlist.exception.ControllerException;
import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.persistence.controller.FilmController;
import com.ensta.myfilmlist.service.MyFilmsService;

import java.util.List;
import javax.validation.Valid;

@RestController
@RequestMapping("/film")
public class FilmControllerImpl implements FilmController {

    @Autowired 
    private MyFilmsService myFilmsService; 

    @Override
    public ResponseEntity<List<FilmDTO>> getAllFilms() throws ControllerException {
        try {
            List<FilmDTO> films = myFilmsService.findAllFilms(); 
            return ResponseEntity.ok(films); 
        } catch (ServiceException e) {
            throw new ControllerException("Erreur lors de la récupération de la liste des films.", e);
        }
    }
    
    @Override
    public ResponseEntity<FilmDTO> getFilmById(long id) throws ControllerException {
        try {
            // Appel de la méthode du Service (qui renvoie null si non trouvé)
            FilmDTO film = myFilmsService.findFilmById(id);
            
            // Gère le cas où la ressource n'est pas trouvée (HTTP 404 Not Found)
            if (film == null) {
                // NOTE: Utiliser build() pour renvoyer une réponse sans corps (body)
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
            }
            
            // Si le film est trouvé (HTTP 200 OK)
            return ResponseEntity.ok(film);
            
        } catch (ServiceException e) {
            // En cas d'erreur lors du traitement (base de données, etc.)
            throw new ControllerException("Erreur lors de la récupération du film avec l'id: " + id, e);
        }
    }
@Override
    public ResponseEntity<FilmDTO> createFilm(@Valid FilmForm filmForm) throws ControllerException {
        // L'annotation @Valid déclenche la vérification des contraintes du FilmForm
        try {
            FilmDTO createdFilm = myFilmsService.createFilm(filmForm);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFilm);
        } catch (ServiceException e) {
            throw new ControllerException("Erreur lors de la création du film.", e);
        }
    }

@Override
    public ResponseEntity<?> deleteFilm(long id) throws ControllerException {
        try {
            myFilmsService.deleteFilm(id);    
            // code 204 (No Content)
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            
        } catch (ServiceException e) {
            throw new ControllerException("Erreur lors de la suppression du film avec l'id: " + id, e);
        }
    }
}