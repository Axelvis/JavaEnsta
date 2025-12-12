/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */

package com.ensta.myfilmlist.service;

import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.model.Realisateur;

/**
 *
 * @author Axel
 */

public interface MyFilmsService {

    /**
     * Met à jour le statut "celebre" de l'utilisateur en fonction de la liste des films qu'il a réalisés.
     * * @param realisateur le réalisateur à mettre à jour (non null)
     * @return le Realisateur mis à jour avec son statut "celebre"
     * @throws ServiceException en cas d'erreur
     */
    Realisateur updateRealisateurCelebre(Realisateur realisateur) throws ServiceException;

    /**
     * Calcule la durée totale d'une liste de films.
     *
     * @param films liste non nulle de films non nuls
     * @return la durée totale (en minutes) des films
     * @throws ServiceException en cas d'erreur
     */
    int calculerDureeTotale(java.util.List<com.ensta.myfilmlist.model.Film> films) throws ServiceException;

}