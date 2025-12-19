package com.ensta.myfilmlist.mapper;

import com.ensta.myfilmlist.form.RealisateurForm;
import com.ensta.myfilmlist.model.Realisateur;

/**
 * Mapper statique pour la conversion entre RealisateurForm et Realisateur (Model).
 */
public final class RealisateurMapper {

    private RealisateurMapper() { }

    /**
     * Convertit un RealisateurForm en entité Realisateur.
     * * @param form Le formulaire contenant les données.
     * @return L'entité Realisateur créée.
     */
    public static Realisateur convertRealisateurFormToRealisateur(RealisateurForm form) {
        Realisateur realisateur = new Realisateur();
        realisateur.setNom(form.getNom());
        realisateur.setPrenom(form.getPrenom());
        realisateur.setDateNaissance(form.getDateNaissance());
        return realisateur;
    }
}