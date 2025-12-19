package com.ensta.myfilmlist.dao.impl;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import com.ensta.myfilmlist.dao.FilmDAO;
import com.ensta.myfilmlist.model.Film;

// @Repository - Désactivé, utiliser JpaFilmDAO à la place
public class JdbcFilmDAO implements FilmDAO {
    
    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public List<Film> findAll() {
        TypedQuery<Film> query = entityManager.createQuery("SELECT f FROM Film f", Film.class);
        return query.getResultList();
    }

    @Override
    public Film findById(long id) {
        return entityManager.find(Film.class, id);
    }

    @Override
    public Film create(Film film) {
        entityManager.persist(film);
        entityManager.flush();
        return film;
    }

    @Override
    public Film update(Film film) {
        return entityManager.merge(film);
    }

    @Override
    public void delete(long id) {
        Film film = entityManager.find(Film.class, id);
        if (film != null) {
            entityManager.remove(film);
        }
    }

    @Override
    public Optional<Film> findOptionalById(long id) {
        return Optional.ofNullable(findById(id));
    }

    @Override
    public void delete(Film film) {
        if (film != null && entityManager.contains(film)) {
            entityManager.remove(film);
        } else if (film != null) {
            Film managed = entityManager.find(Film.class, film.getId());
            if (managed != null) {
                entityManager.remove(managed);
            }
        }
    }

    @Override
    public List<Film> findByRealisateurId(long realisateurId) {
        TypedQuery<Film> query = entityManager.createQuery(
            "SELECT f FROM Film f WHERE f.realisateur.id = :realisateurId", 
            Film.class
        );
        query.setParameter("realisateurId", realisateurId);
        return query.getResultList();
    }

    @Override
    public Film findByTitre(String titre) {
        TypedQuery<Film> query = entityManager.createQuery(
            "SELECT f FROM Film f WHERE f.titre LIKE :titre", 
            Film.class
        );
        query.setParameter("titre", "%" + titre + "%");
        List<Film> results = query.getResultList();
        return results.isEmpty() ? null : results.get(0);
    }

}
