package com.ensta.myfilmlist.dao;

import java.util.List;
import com.ensta.myfilmlist.model.Film;
import java.util.Optional;

public interface FilmDAO {
    
    List<Film> findAll();
    Film findById(long id);
    Film create(Film film);
    Film update(Film film);
    void delete(long id);
    Optional<Film> findOptionalById(long id);
    void delete(Film film);
    List<Film> findByRealisateurId(long realisateurId);
    Film findByTitre(String titre);

}