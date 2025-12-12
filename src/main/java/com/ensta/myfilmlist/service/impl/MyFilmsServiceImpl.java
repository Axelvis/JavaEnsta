/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.ensta.myfilmlist.service.impl;

import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.model.Realisateur;
import com.ensta.myfilmlist.service.MyFilmsService;


/**
 *
 * @author Axel
 */
public class MyFilmsServiceImpl implements MyFilmsService {
    private static final int NB_FILMS_MIN_REALISATEUR_CELEBRE = 3;

    @Override 
    public Realisateur updateRealisateurCelebre(Realisateur realisateur) throws ServiceException {
        try {
            // Si au moins 3 films, statut passe à true
            if (realisateur.getFilmRealises().size() >= NB_FILMS_MIN_REALISATEUR_CELEBRE) {
                realisateur.setCelebre(true);
            } else {
                // Sinon, statut passe à false 
                realisateur.setCelebre(false);
            }
            
            // La méthode renvoie le Realisateur mis à jour
            return realisateur;

        } catch (Exception e) {
            // 2.5. La méthode renvoie une exception de type ServiceException en cas d'erreur 
            throw new ServiceException("Erreur lors de la mise à jour du statut célèbre", e);
        }
    }
}