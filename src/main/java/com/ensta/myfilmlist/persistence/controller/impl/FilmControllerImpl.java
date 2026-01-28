package com.ensta.myfilmlist.persistence.controller.impl;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ensta.myfilmlist.dto.FilmDTO;
import com.ensta.myfilmlist.exception.ControllerException;
import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.form.FilmForm;
import com.ensta.myfilmlist.persistence.controller.FilmController;
import com.ensta.myfilmlist.service.MyFilmsService;

@RestController
@CrossOrigin(origins = "*")
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
           
            FilmDTO film = myFilmsService.findFilmById(id);
            

            if (film == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
            }
            
            return ResponseEntity.ok(film);
            
        } catch (ServiceException e) {
            throw new ControllerException("Erreur lors de la récupération du film avec l'id: " + id, e);
        }
    }
@Override
    public ResponseEntity<FilmDTO> createFilm(@Valid FilmForm filmForm) throws ControllerException {
        try {
            FilmDTO createdFilm = myFilmsService.createFilm(filmForm);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFilm);
        } catch (ServiceException e) {
            throw new ControllerException("Erreur lors de la création du film.", e);
        }
    }

    @Override
    public ResponseEntity<FilmDTO> updateFilm(long id, @Valid FilmForm filmForm) throws ControllerException {
        try {
            FilmDTO updatedFilm = myFilmsService.updateFilm(id, filmForm);
            if (updatedFilm == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(updatedFilm);
        } catch (ServiceException e) {
            throw new ControllerException("Erreur lors de la mise à jour du film avec l'id: " + id, e);
        }
    }

@Override
    public ResponseEntity<?> deleteFilm(long id) throws ControllerException {
        try {
            myFilmsService.deleteFilm(id);    
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            
        } catch (ServiceException e) {
            throw new ControllerException("Erreur lors de la suppression du film avec l'id: " + id, e);
        }
    }
}
