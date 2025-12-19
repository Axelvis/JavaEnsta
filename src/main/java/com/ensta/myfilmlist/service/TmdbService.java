package com.ensta.myfilmlist.service;

import com.ensta.myfilmlist.exception.ServiceException;
import java.time.LocalDate;
import java.util.List;

public interface TmdbService {
    
    /**
     * Données d'un film récupérées depuis TMDB
     */
    class TmdbFilmData {
        private String titre;
        private int duree;
        private LocalDate dateSortie;
        private String posterUrl;
        private List<TmdbDirector> directors;
        
        public String getTitre() { return titre; }
        public void setTitre(String titre) { this.titre = titre; }
        
        public int getDuree() { return duree; }
        public void setDuree(int duree) { this.duree = duree; }
        
        public LocalDate getDateSortie() { return dateSortie; }
        public void setDateSortie(LocalDate dateSortie) { this.dateSortie = dateSortie; }
        
        public String getPosterUrl() { return posterUrl; }
        public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
        
        public List<TmdbDirector> getDirectors() { return directors; }
        public void setDirectors(List<TmdbDirector> directors) { this.directors = directors; }
    }
    
    /**
     * Données d'un réalisateur récupérées depuis TMDB
     */
    class TmdbDirector {
        private String nom;
        private String prenom;
        private LocalDate dateNaissance;
        
        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }
        
        public String getPrenom() { return prenom; }
        public void setPrenom(String prenom) { this.prenom = prenom; }
        
        public LocalDate getDateNaissance() { return dateNaissance; }
        public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }
    }
    
    /**
     * Recherche un film par son titre et récupère toutes ses données
     */
    TmdbFilmData searchFilmByTitle(String titre) throws ServiceException;
}
