package com.ensta.myfilmlist.persistence.controller;

import com.ensta.myfilmlist.dto.RealisateurDTO;
import com.ensta.myfilmlist.exception.ControllerException;
import com.ensta.myfilmlist.form.RealisateurForm;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import io.swagger.annotations.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;

import java.util.List;

@Api(tags = "Realisateur")
@Tag(name = "Realisateur", description = "Opérations CRUD sur les réalisateurs")
public interface RealisateurController {

    @GetMapping
    @ApiOperation(value = "Lister les réalisateurs", notes = "Renvoie la liste de tous les réalisateurs.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "Liste renvoyée correctement")})
    ResponseEntity<List<RealisateurDTO>> getAllRealisateurs() throws ControllerException;

    @GetMapping("/{id}")
    @ApiOperation(value = "Récupérer un réalisateur", notes = "Renvoie un réalisateur par son ID.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Réalisateur trouvé et renvoyé"),
        @ApiResponse(code = 404, message = "Réalisateur non trouvé")
    })
    ResponseEntity<RealisateurDTO> getRealisateurById(@PathVariable long id) throws ControllerException;

    @PostMapping
    @ApiOperation(value = "Créer un réalisateur", notes = "Crée un nouveau réalisateur.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiResponses(value = {
        @ApiResponse(code = 201, message = "Réalisateur créé avec succès"),
        @ApiResponse(code = 400, message = "Données invalides")
    })
    ResponseEntity<RealisateurDTO> createRealisateur(@RequestBody @Valid RealisateurForm realisateurForm) throws ControllerException;
}
