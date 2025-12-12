import axios from 'axios';

const FILM_URI = 'http://localhost:8080/film';

export function getAllFilms() {
    return axios.get(FILM_URI);
}

export function postFilm(film) {
    return axios.post(FILM_URI, film);
}

// Fonction pour supprimer un film par son ID
export function deleteFilm(id) {
    return axios.delete(`${FILM_URI}/${id}`);
}

// Fonction pour modifier (sera utilisée pour l'édition)
export function putFilm(film) {
    return axios.delete(`${FILM_URI}/${film.id}`)
        .then(() => axios.post(FILM_URI, film));
}