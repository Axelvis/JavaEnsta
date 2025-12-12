package com.ensta.myfilmlist.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import com.ensta.myfilmlist.dao.FilmDAO;
import com.ensta.myfilmlist.dao.RealisateurDAO;
import com.ensta.myfilmlist.model.Film;
import com.ensta.myfilmlist.model.Realisateur;
import com.ensta.myfilmlist.persistence.ConnectionManager;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcRealisateurDAO implements RealisateurDAO {

    private JdbcTemplate jdbcTemplate = ConnectionManager.getJdbcTemplate();
    private FilmDAO filmDAO = new JdbcFilmDAO();

    private static final String FIND_ALL_QUERY = "SELECT id, nom, prenom, date_naissance FROM Realisateur";
    private static final String FIND_BY_ID_QUERY = "SELECT id, nom, prenom, date_naissance FROM Realisateur WHERE id = ?";
    private static final String FIND_BY_NOM_PRENOM_QUERY = "SELECT id, nom, prenom, date_naissance FROM Realisateur WHERE nom = ? AND prenom = ?";
    private static final String UPDATE_QUERY = "UPDATE Realisateur SET nom = ?, prenom = ?, date_naissance = ?, celebre = ? WHERE id = ?";
    private static final String INSERT_QUERY = "INSERT INTO Realisateur (nom, prenom, date_naissance, celebre) VALUES (?, ?, ?, ?)";

    private RowMapper<Realisateur> realisateurMapper = (rs, rowNum) -> {
        Realisateur r = new Realisateur();
        r.setId(rs.getLong("id"));
        r.setNom(rs.getString("nom"));
        r.setPrenom(rs.getString("prenom"));
        r.setDateNaissance(rs.getDate("date_naissance").toLocalDate());
        return r;
    };

    @Override
    public List<Realisateur> findAll() {
        return jdbcTemplate.query(FIND_ALL_QUERY, realisateurMapper);
    }

    @Override
    public Realisateur findByNomAndPrenom(String nom, String prenom) {
        try {
            Realisateur r = jdbcTemplate.queryForObject(
                FIND_BY_NOM_PRENOM_QUERY,
                realisateurMapper,
                nom,
                prenom
            );

            List<Film> films = filmDAO.findByRealisateurId(r.getId());
            r.setFilmsRealises(films);
            return r;

        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public Optional<Realisateur> findById(long id) {
        try {
            Realisateur r = jdbcTemplate.queryForObject(
                FIND_BY_ID_QUERY,
                realisateurMapper,
                id
            );

            List<Film> films = filmDAO.findByRealisateurId(r.getId());
            r.setFilmsRealises(films);
            return Optional.of(r);

        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Realisateur update(Realisateur realisateur) {
        jdbcTemplate.update(
            UPDATE_QUERY,
            realisateur.getNom(),
            realisateur.getPrenom(),
            java.sql.Date.valueOf(realisateur.getDateNaissance()),
            realisateur.isCelebre(),
            realisateur.getId()
        );
        return realisateur;
    }

    @Override
    public Realisateur save(Realisateur realisateur) {
        jdbcTemplate.update(
            INSERT_QUERY,
            realisateur.getNom(),
            realisateur.getPrenom(),
            java.sql.Date.valueOf(realisateur.getDateNaissance()),
            realisateur.isCelebre()
        );

        Long id = jdbcTemplate.queryForObject("SELECT MAX(id) FROM Realisateur", Long.class);
        realisateur.setId(id);

        return realisateur;
    }
}
