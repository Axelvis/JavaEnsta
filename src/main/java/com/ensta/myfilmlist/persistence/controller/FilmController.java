package com.ensta.myfilmlist.persistence.controller;

import com.ensta.myfilmlist.dto.FilmDTO;
import com.ensta.myfilmlist.exception.ControllerException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; 
import org.springframework.http.MediaType; 
import com.ensta.myfilmlist.form.FilmForm; 
import org.springframework.web.bind.annotation.PostMapping; 
import org.springframework.web.bind.annotation.RequestBody; 
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Api(tags = "Film") 
@Tag(name = "Film", description = "Opération sur les films")
public interface FilmController {
    
    // Documenation Swagger getAllFilms()
    @GetMapping
    @ApiOperation(
        value = "Lister les films", 
        notes = "Permet de renvoyer la liste de tous les films.", 
        produces = MediaType.APPLICATION_JSON_VALUE 
    )
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "La liste des films a été renvoyée correctement") // 200=OK
    })
    ResponseEntity<List<FilmDTO>> getAllFilms() throws ControllerException;

    
    // Doc getFilmById()
    @GetMapping("/{id}")
    @ApiOperation(
        value = "Récupérer un film par ID",
        notes = "Permet de renvoyer un film spécifique en utilisant son identifiant.",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Le film a été trouvé et renvoyé"),
        @ApiResponse(code = 404, message = "Le film avec cet identifiant n'existe pas")
    })
    ResponseEntity<FilmDTO> getFilmById(@PathVariable long id) throws ControllerException;


    /** 
    * Crée un nouveau film dans la base de données.
     * Le code HTTP de retour est 201 (Created).
     * @param filmForm Le formulaire contenant les données du nouveau film.
     * @return ResponseEntity contenant le FilmDTO créé avec son identifiant.
     * @throws ControllerException En cas d'erreur de traitement.
     */
    @PostMapping // Mapping pour répondre aux requêtes HTTP POST sur /film
    @ApiOperation(
        value = "Créer un film",
        notes = "Crée un nouveau film et renvoie le film créé.",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ApiResponses(value = {
        @ApiResponse(code = 201, message = "Le film a été créé avec succès"),
        @ApiResponse(code = 400, message = "Données d'entrée invalides (ex: réalisateur inexistant)")
    })
    ResponseEntity<FilmDTO> createFilm(@RequestBody FilmForm filmForm) throws ControllerException;

    /**
     * Met à jour un film existant dans la base de données.
     * Le code HTTP de retour est 200 (OK).
     * @param id L'identifiant du film à mettre à jour.
     * @param filmForm Le formulaire contenant les données du film.
     * @return ResponseEntity contenant le FilmDTO mis à jour.
     * @throws ControllerException En cas d'erreur de traitement.
     */
    @PutMapping("/{id}")
    @ApiOperation(
        value = "Mettre à jour un film",
        notes = "Met à jour un film existant et renvoie le film mis à jour.",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Le film a été mis à jour avec succès"),
        @ApiResponse(code = 404, message = "Le film à mettre à jour n'existe pas")
    })
    ResponseEntity<FilmDTO> updateFilm(@PathVariable long id, @RequestBody FilmForm filmForm) throws ControllerException;

/**
     * Supprime un film de la base de données via son identifiant.
     * Le code HTTP de retour est 204 (No Content).
     * @param id L'identifiant du film à supprimer.
     * @return ResponseEntity vide (pas de corps) avec le statut 204.
     * @throws ControllerException En cas d'erreur de traitement.
     */
    @DeleteMapping("/{id}") // Mapping pour répondre aux requêtes HTTP DELETE sur /film/{id}
    @ApiOperation(
        value = "Supprimer un film par ID",
        notes = "Supprime un film spécifique en utilisant son identifiant.",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ApiResponses(value = {
        @ApiResponse(code = 204, message = "Le film a été supprimé avec succès (No Content)"),
        @ApiResponse(code = 404, message = "Le film à supprimer n'existe pas")
    })
    ResponseEntity<?> deleteFilm(@PathVariable long id) throws ControllerException;

}