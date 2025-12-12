package com.ensta.myfilmlist.mapper;

import com.ensta.myfilmlist.dto.FilmDTO;
import com.ensta.myfilmlist.model.Film;

public class FilmDTOMapper {

    /**
     * Convertit Film -> FilmDTO
     */
    public static FilmDTO convertFilmToFilmDTO(Film film) {
        if (film == null) {
            return null;
        }

        FilmDTO dto = new FilmDTO();
        dto.setId(film.getId());
        dto.setTitre(film.getTitre());
        dto.setDuree(film.getDuree());

        dto.setRealisateur(
            RealisateurDTOMapper.convertRealisateurToRealisateurDTO(film.getRealisateur())
        );

        return dto;
    }

    /**
     * Convertit FilmDTO -> Film (objet métier)
     */
    public static Film convertFilmDTOToFilm(FilmDTO dto) {
        if (dto == null) {
            return null;
        }

        Film film = new Film();
        film.setId(dto.getId());
        film.setTitre(dto.getTitre());
        film.setDuree(dto.getDuree());

        film.setRealisateur(
            RealisateurDTOMapper.convertRealisateurDTOToRealisateur(dto.getRealisateur())
        );

        return film;
    }
}
