package com.ensta.myfilmlist;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.ensta.myfilmlist.dao.FilmDAO;
import com.ensta.myfilmlist.dao.RealisateurDAO;
import com.ensta.myfilmlist.model.Film;
import com.ensta.myfilmlist.model.Realisateur;

@SpringBootTest
@Transactional // Annule les modifications DB après chaque test pour garder un état propre
public class FilmsDAOTests {

    @Autowired
    private FilmDAO filmDAO;

    @Autowired
    private RealisateurDAO realisateurDAO;

    /**
     * NIVEAU : RAPIDE
     * Teste la récupération de tous les films.
     * Suppose que data.sql a inséré des données au démarrage.
     */
    @Test
    public void findAllTest() {
        List<Film> films = filmDAO.findAll();
        assertNotNull(films);
        assertFalse(films.isEmpty(), "La liste des films ne devrait pas être vide (voir data.sql)");
    }

    /**
     * NIVEAU : MOYEN
     * Teste la recherche d'un film par son ID.
     */
    @Test
    public void findByIdTest() {
        // On récupère d'abord un film existant pour être sûr d'avoir un ID valide
        List<Film> films = filmDAO.findAll();
        long idExist = films.get(0).getId();

        Optional<Film> filmOpt = Optional.ofNullable(filmDAO.findById(idExist));

        assertTrue(filmOpt.isPresent());
        assertEquals(idExist, filmOpt.get().getId());
    }

    /**
     * NIVEAU : DIFFICILE
     * Teste la création d'un film.
     * Nécessite un réalisateur existant.
     */
    @Test
    public void saveTest() {
        // Préparation : Récupérer un réalisateur existant (id=1 par exemple)
        Realisateur realisateur = realisateurDAO.findById(1).orElseThrow();

        Film nouveauFilm = new Film();
        nouveauFilm.setTitre("Test DAO Movie");
        nouveauFilm.setDuree(120);
        nouveauFilm.setRealisateur(realisateur);
        nouveauFilm.setRealisateurId(realisateur.getId());

        // Action
        Film filmCree = filmDAO.create(nouveauFilm);

        // Vérification
        assertNotNull(filmCree.getId(), "L'ID du film créé ne doit pas être null");
        assertEquals("Test DAO Movie", filmCree.getTitre());
        
        // Vérification en base
        Optional<Film> filmEnBase = Optional.ofNullable(filmDAO.findById(filmCree.getId()));
        assertTrue(filmEnBase.isPresent());
    }
}