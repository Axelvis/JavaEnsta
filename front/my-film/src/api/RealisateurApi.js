import axios from 'axios';

const REALISATEUR_URI = 'http://localhost:8080/realisateur';

export function getAllRealisateurs() {
    return axios.get(REALISATEUR_URI);
}