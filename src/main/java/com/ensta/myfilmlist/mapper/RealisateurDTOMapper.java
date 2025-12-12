package com.ensta.myfilmlist.mapper;

import com.ensta.myfilmlist.dto.RealisateurDTO;
import com.ensta.myfilmlist.model.Realisateur;

public class RealisateurDTOMapper {

    /**
     * Convertit un Realisateur (modèle) en RealisateurDTO.
     * Ne mappe pas l'attribut filmRealises (laisse null).
     *
     * @param realisateur entité métier Realisateur
     * @return le DTO correspondant, ou null si realisateur est null
     */
    public static RealisateurDTO convertRealisateurToRealisateurDTO(Realisateur realisateur) {
        if (realisateur == null) {
            return null;
        }

        RealisateurDTO dto = new RealisateurDTO();
        dto.setId(realisateur.getId());
        dto.setNom(realisateur.getNom());
        dto.setPrenom(realisateur.getPrenom());
        dto.setDateNaissance(realisateur.getDateNaissance());
        dto.setCelebre(realisateur.isCelebre());

        return dto;
    }

    /**
     * Convertit un RealisateurDTO en Realisateur (modèle).
     * Ne mappe pas l'attribut filmRealises.
     *
     * @param dto DTO RealisateurDTO
     * @return l'entité métier correspondante, ou null si dto est null
     */
    public static Realisateur convertRealisateurDTOToRealisateur(RealisateurDTO dto) {
        if (dto == null) {
            return null;
        }

        Realisateur realisateur = new Realisateur();
        realisateur.setId(dto.getId());
        realisateur.setNom(dto.getNom());
        realisateur.setPrenom(dto.getPrenom());
        realisateur.setDateNaissance(dto.getDateNaissance());
        realisateur.setCelebre(dto.isCelebre());

        return realisateur;
    }
}
