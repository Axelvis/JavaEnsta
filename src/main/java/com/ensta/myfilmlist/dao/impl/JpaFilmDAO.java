package com.ensta.myfilmlist.dao.impl;

import com.ensta.myfilmlist.dao.FilmDAO;
import com.ensta.myfilmlist.model.Film;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Primary
public class JpaFilmDAO implements FilmDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Film> findAll() {
        return entityManager
                .createQuery("SELECT f FROM Film f LEFT JOIN FETCH f.realisateur", Film.class)
                .getResultList();
    }

    @Override
    public Film findById(long id) {
        return entityManager.find(Film.class, id);
    }

    @Override
    public Optional<Film> findOptionalById(long id) {
        return Optional.ofNullable(entityManager.find(Film.class, id));
    }

    @Override
    public Film create(Film film) {
        entityManager.persist(film);
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
    public void delete(Film film) {
        if (film == null || film.getId() == 0) {
            return;
        }
        Film filmEnBase = entityManager.find(Film.class, film.getId());
        if (filmEnBase == null) {
            return;
        }
        if (!entityManager.contains(film)) {
            film = entityManager.merge(film);
        }
        entityManager.remove(film);
    }

    @Override
    public List<Film> findByRealisateurId(long realisateurId) {
        return entityManager
                .createQuery(
                    "SELECT f FROM Film f WHERE f.realisateur.id = :id",
                    Film.class
                )
                .setParameter("id", realisateurId)
                .getResultList();
    }
}
