package com.ensta.myfilmlist.mapper;

import com.ensta.myfilmlist.form.RealisateurForm;
import com.ensta.myfilmlist.model.Realisateur;

/**
 * Mapper statique pour la conversion entre RealisateurForm et Realisateur (Model).
 */
public final class RealisateurMapper {

    // Constructeur privé pour empêcher l'instanciation de cette classe utilitaire
    private RealisateurMapper() {
        // Constructeur privé
    }

    /**
     * Convertit un RealisateurForm en entité Realisateur.
     * * @param form Le formulaire contenant les données.
     * @return L'entité Realisateur créée.
     */
    public static Realisateur convertRealisateurFormToRealisateur(RealisateurForm form) {
        Realisateur realisateur = new Realisateur();
        // L'ID est généré par la DB, donc on ne le set pas ici.
        realisateur.setNom(form.getNom());
        realisateur.setPrenom(form.getPrenom());
        realisateur.setDateNaissance(form.getDateNaissance());
        // L'attribut 'celebre' sera initialisé dans le service (false)
        return realisateur;
    }
}