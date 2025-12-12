package com.ensta.myfilmlist.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.ensta.myfilmlist.dao.FilmDAO;
import com.ensta.myfilmlist.model.Film;
import com.ensta.myfilmlist.model.Realisateur;
import com.ensta.myfilmlist.persistence.ConnectionManager;
@Repository
public class JdbcFilmDAO implements FilmDAO {
    
    private static final String FIND_ALL_QUERY =
        "SELECT f.id as film_id, f.titre, f.duree, " +
        "r.id as realisateur_id, r.nom as realisateur_nom, r.prenom as realisateur_prenom, " +
        "r.date_naissance as realisateur_date_naissance, r.celebre as realisateur_celebre " +
        "FROM Film f " +
        "LEFT JOIN Realisateur r ON f.realisateur_id = r.id";
    private static final String FIND_BY_ID_QUERY =
        "SELECT f.id as film_id, f.titre, f.duree, " +
        "r.id as realisateur_id, r.nom as realisateur_nom, r.prenom as realisateur_prenom, " +
        "r.date_naissance as realisateur_date_naissance, r.celebre as realisateur_celebre " +
        "FROM Film f " +
        "LEFT JOIN Realisateur r ON f.realisateur_id = r.id " +
        "WHERE f.id = ?";
    private static final String INSERT_QUERY =
        "INSERT INTO Film (titre, duree, realisateur_id) VALUES (?, ?, ?)";
    private static final String DELETE_QUERY = "DELETE FROM Film WHERE id = ?";
    private static final String FIND_BY_REALISATEUR_ID_QUERY =
        "SELECT f.id as film_id, f.titre, f.duree, " +
        "r.id as realisateur_id, r.nom as realisateur_nom, r.prenom as realisateur_prenom, " +
        "r.date_naissance as realisateur_date_naissance, r.celebre as realisateur_celebre " +
        "FROM Film f " +
        "LEFT JOIN Realisateur r ON f.realisateur_id = r.id " +
        "WHERE f.realisateur_id = ?";

    private JdbcTemplate jdbcTemplate = ConnectionManager.getJdbcTemplate();
    
    
    private final RowMapper<Film> filmMapper = (rs, rowNum) -> {
		Film film = new Film();
		film.setId(rs.getLong("film_id"));
		film.setTitre(rs.getString("titre"));
		film.setDuree(rs.getInt("duree"));

		long realisateurId = rs.getLong("realisateur_id");
		film.setRealisateurId(realisateurId);

		if (realisateurId != 0) {
			Realisateur realisateur = new Realisateur();
			realisateur.setId(realisateurId);
			realisateur.setNom(rs.getString("realisateur_nom"));
			realisateur.setPrenom(rs.getString("realisateur_prenom"));
			realisateur.setDateNaissance(
				rs.getDate("realisateur_date_naissance").toLocalDate()
			);
			realisateur.setCelebre(rs.getBoolean("realisateur_celebre"));
			film.setRealisateur(realisateur);
		}

		return film;
	};


    @Override
    public List<Film> findAll() {
        
        /*List<Film> films = new ArrayList<>();

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(FIND_ALL_QUERY);
             ResultSet rs = statement.executeQuery()) {

            while (rs.next()) {
                Film film = new Film();
                film.setId(rs.getLong("id"));
                film.setTitre(rs.getString("titre"));
                film.setDuree(rs.getInt("duree"));
                films.add(film);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return films;*/

        return jdbcTemplate.query(FIND_ALL_QUERY, filmMapper);
    }

    @Override
    public Film findById(long id) {
        try {
            return jdbcTemplate.queryForObject(
                FIND_BY_ID_QUERY,
                (rs, rowNum) -> {
                    Film film = new Film();
                    film.setId(rs.getLong("film_id"));
                    film.setTitre(rs.getString("titre"));
                    film.setDuree(rs.getInt("duree"));

                    long realisateurId = rs.getLong("realisateur_id");
                    film.setRealisateurId(realisateurId);

                    if (realisateurId != 0) {
                        Realisateur realisateur = new Realisateur();
                        realisateur.setId(realisateurId);
                        realisateur.setNom(rs.getString("realisateur_nom"));
                        realisateur.setPrenom(rs.getString("realisateur_prenom"));
                        realisateur.setDateNaissance(
                            rs.getDate("realisateur_date_naissance").toLocalDate()
                        );
                        realisateur.setCelebre(rs.getBoolean("realisateur_celebre"));
                        film.setRealisateur(realisateur);
                    }
                    return film;
                },
                id
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public Film create(Film film) {
        jdbcTemplate.update(
            INSERT_QUERY,
            film.getTitre(),
            film.getDuree(),
            film.getRealisateurId()
        );
        Long id = jdbcTemplate.queryForObject("SELECT MAX(id) FROM Film", Long.class);
        film.setId(id);
        return film;
    }

    @Override
    public void delete(long id) {
        jdbcTemplate.update(DELETE_QUERY, id);
    }

    @Override
    public Optional<Film> findOptionalById(long id) {
        try {
            Film film = findById(id);
            return Optional.ofNullable(film);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public void delete(Film film) {
        if (film == null) {
            return;
        }
        delete(film.getId());
    }

    @Override
    public List<Film> findByRealisateurId(long realisateurId) {
        return jdbcTemplate.query(
            FIND_BY_REALISATEUR_ID_QUERY,
            filmMapper,
            realisateurId
        );
    }

}
