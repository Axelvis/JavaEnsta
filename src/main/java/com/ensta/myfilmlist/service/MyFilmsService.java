package com.ensta.myfilmlist.service;

import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.form.FilmForm;
import com.ensta.myfilmlist.model.Film;
import com.ensta.myfilmlist.model.Realisateur;
import com.ensta.myfilmlist.dto.FilmDTO;
import com.ensta.myfilmlist.dto.RealisateurDTO;

import java.util.List;
import java.util.Optional;

public interface MyFilmsService {

    Realisateur updateRealisateurCelebre(Realisateur realisateur) throws ServiceException;
    long calculerDureeTotale(List<Film> films);
    double calculerNoteMoyenne(double[] notes);
    List<Realisateur> updateRealisateurCelebres(List<Realisateur> realisateurs) throws ServiceException;
    
    List<FilmDTO> findAllFilms() throws ServiceException;
    FilmDTO findFilmById(long id) throws ServiceException;

    FilmDTO createFilm(FilmForm form) throws ServiceException;
    FilmDTO updateFilm(long id, FilmForm form) throws ServiceException;
    List<Realisateur> findAllRealisateurs() throws ServiceException;
    Optional<Realisateur> findRealisateurById(long id) throws ServiceException;
    RealisateurDTO findRealisateurByNomAndPrenom(String nom, String prenom) throws ServiceException;
    void deleteFilm(long id) throws ServiceException;

    RealisateurDTO createRealisateur(RealisateurDTO realisateur) throws ServiceException;
    RealisateurDTO findRealisateurDTOById(long id) throws ServiceException;

}
