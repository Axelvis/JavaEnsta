package com.ensta.myfilmlist.persistence.controller.impl;

import com.ensta.myfilmlist.dto.RealisateurDTO;
import com.ensta.myfilmlist.exception.ControllerException;
import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.form.RealisateurForm;
import com.ensta.myfilmlist.persistence.controller.RealisateurController;
import com.ensta.myfilmlist.service.RealisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/realisateur")
public class RealisateurControllerImpl implements RealisateurController {

    @Autowired
    private RealisateurService realisateurService;

    // --- 1. GET ALL ---
    @Override
    public ResponseEntity<List<RealisateurDTO>> getAllRealisateurs() throws ControllerException {
        try {
            List<RealisateurDTO> realisateurs = realisateurService.getAllRealisateurs();
            return ResponseEntity.ok(realisateurs);
        } catch (ServiceException e) {
            throw new ControllerException("Erreur lors de la récupération des réalisateurs.", e);
        }
    }

    // --- 2. GET BY ID ---
    @Override
    public ResponseEntity<RealisateurDTO> getRealisateurById(long id) throws ControllerException {
        try {
            RealisateurDTO realisateur = realisateurService.getRealisateurById(id);
            if (realisateur == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(realisateur);
        } catch (ServiceException e) {
            throw new ControllerException("Erreur lors de la récupération du réalisateur " + id, e);
        }
    }

    // --- 3. POST (Création) ---
    @Override
    public ResponseEntity<RealisateurDTO> createRealisateur(@Valid RealisateurForm realisateurForm) throws ControllerException {
        try {
            RealisateurDTO createdRealisateur = realisateurService.createRealisateur(realisateurForm);
            // Renvoie le statut 201 Created
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRealisateur);
        } catch (ServiceException e) {
            throw new ControllerException("Erreur lors de la création du réalisateur.", e);
        }
    }
}