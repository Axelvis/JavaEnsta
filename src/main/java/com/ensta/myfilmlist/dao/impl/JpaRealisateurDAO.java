package com.ensta.myfilmlist.dao.impl;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import com.ensta.myfilmlist.dao.RealisateurDAO;
import com.ensta.myfilmlist.model.Realisateur;

@Repository
@Primary
public class JpaRealisateurDAO implements RealisateurDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Realisateur> findAll() {
        return entityManager
                .createQuery("SELECT r FROM Realisateur r", Realisateur.class)
                .getResultList();
    }

    @Override
    public Optional<Realisateur> findById(long id) {
        return Optional.ofNullable(
            entityManager.find(Realisateur.class, id)
        );
    }

    @Override
    public Realisateur findByNomAndPrenom(String nom, String prenom) {
        List<Realisateur> resultats = entityManager
                .createQuery(
                    "SELECT r FROM Realisateur r WHERE r.nom = :nom AND r.prenom = :prenom",
                    Realisateur.class
                )
                .setParameter("nom", nom)
                .setParameter("prenom", prenom)
                .getResultList();
        return resultats.isEmpty() ? null : resultats.get(0);
    }

    @Override
    public Realisateur save(Realisateur realisateur) {
        entityManager.persist(realisateur);
        return realisateur;
    }

    @Override
    public Realisateur update(Realisateur realisateur) {
        return entityManager.merge(realisateur);
    }
}
