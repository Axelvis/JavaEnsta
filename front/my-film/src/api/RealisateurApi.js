import axios from 'axios';

const REALISATEUR_URI = 'http://localhost:8080/realisateur';

export function getAllRealisateurs() {
    return axios.get(REALISATEUR_URI);
}

export function postRealisateur(realisateur) {
    return axios.post(REALISATEUR_URI, realisateur);
}