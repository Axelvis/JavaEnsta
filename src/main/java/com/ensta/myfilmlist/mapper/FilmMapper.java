package com.ensta.myfilmlist.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.ensta.myfilmlist.dto.FilmDTO;
import com.ensta.myfilmlist.form.FilmForm;
import com.ensta.myfilmlist.model.Film;

public class FilmMapper {

	public static List<FilmDTO> convertFilmToFilmDTOs(List<Film> films) {
		return films.stream()
				.map(FilmMapper::convertFilmToFilmDTO)
				.collect(Collectors.toList());
	}

	public static FilmDTO convertFilmToFilmDTO(Film film) {
		FilmDTO filmDTO = new FilmDTO();
		filmDTO.setId(film.getId());
		filmDTO.setTitre(film.getTitre());
		filmDTO.setDuree(film.getDuree());
		filmDTO.setDateSortie(film.getDateSortie());
		filmDTO.setPosterUrl(film.getPosterUrl());
		filmDTO.setDateAjout(film.getDateAjout());
		filmDTO.setWatchProviders(film.getWatchProviders());
		filmDTO.setRating(film.getRating());
		filmDTO.setSynopsis(film.getSynopsis());

		if (film.getRealisateur() != null) {
			filmDTO.setRealisateur(
				RealisateurDTOMapper.convertRealisateurToRealisateurDTO(film.getRealisateur())
			);
		}

		return filmDTO;
	}

	public static Film convertFilmDTOToFilm(FilmDTO filmDTO) {
		Film film = new Film();
		film.setId(filmDTO.getId());
		film.setTitre(filmDTO.getTitre());
		film.setDuree(filmDTO.getDuree());

		return film;
	}

	public static Film convertFilmFormToFilm(FilmForm filmForm) {
		Film film = new Film();
		film.setTitre(filmForm.getTitre());

		return film;
	}
}

