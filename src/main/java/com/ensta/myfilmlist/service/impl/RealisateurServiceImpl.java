package com.ensta.myfilmlist.service.impl;

import com.ensta.myfilmlist.mapper.RealisateurMapper;
import com.ensta.myfilmlist.dao.RealisateurDAO;
import com.ensta.myfilmlist.dto.RealisateurDTO;
import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.form.RealisateurForm;
import com.ensta.myfilmlist.mapper.RealisateurDTOMapper;
import com.ensta.myfilmlist.model.Realisateur;
import com.ensta.myfilmlist.service.RealisateurService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RealisateurServiceImpl implements RealisateurService {

    @Autowired
    private RealisateurDAO realisateurDAO;

    // Méthode de conversion (à créer si non existante)
    // private Realisateur convertRealisateurFormToRealisateur(RealisateurForm form) { ... }
    
    @Override
    public List<RealisateurDTO> getAllRealisateurs() throws ServiceException {
        try {
            // Lecture simple, pas besoin de @Transactional
            return realisateurDAO.findAll()
                .stream()
                .map(RealisateurDTOMapper::convertRealisateurToRealisateurDTO)
                .toList();
        } catch (Exception e) {
            throw new ServiceException("Erreur lors de la récupération de la liste des réalisateurs.", e);
        }
    }

    @Override
    public RealisateurDTO getRealisateurById(long id) throws ServiceException {
        try {
            // Lecture simple, pas besoin de @Transactional
            Optional<Realisateur> realisateur = realisateurDAO.findById(id);
            return realisateur.map(RealisateurDTOMapper::convertRealisateurToRealisateurDTO).orElse(null);
        } catch (Exception e) {
            throw new ServiceException("Erreur lors de la récupération du réalisateur avec l'id: " + id, e);
        }
    }

    // Création simple, PAS BESOIN de @Transactional car une seule opération (save)
    @Override
    public RealisateurDTO createRealisateur(RealisateurForm form) throws ServiceException {
        try {
            // Mapping du Form vers le Model
            Realisateur realisateur = RealisateurMapper.convertRealisateurFormToRealisateur(form); 
            
            // Initialisation de celebre à false (car 0 film réalisé au début)
            realisateur.setCelebre(false); 
            
            realisateur = realisateurDAO.save(realisateur);
            
            return RealisateurDTOMapper.convertRealisateurToRealisateurDTO(realisateur);
        } catch (Exception e) {
            throw new ServiceException("Erreur lors de la création du réalisateur.", e);
        }
    }
}