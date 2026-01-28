package com.ensta.myfilmlist.mapper;

import com.ensta.myfilmlist.form.RealisateurForm;
import com.ensta.myfilmlist.model.Realisateur;

public final class RealisateurMapper {

    private RealisateurMapper() { }

    public static Realisateur convertRealisateurFormToRealisateur(RealisateurForm form) {
        Realisateur realisateur = new Realisateur();
        realisateur.setNom(form.getNom());
        realisateur.setPrenom(form.getPrenom());
        realisateur.setDateNaissance(form.getDateNaissance());
        return realisateur;
    }
}
