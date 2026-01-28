package com.ensta.myfilmlist.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;


public class FilmDTO {

	private long id;

	private String titre;

	private int duree;
	
	private LocalDate dateSortie;
	
	private String posterUrl;
	
	private LocalDateTime dateAjout;
	
	private String watchProviders;
	
	private Double rating;
	
	private String synopsis;
	
	private RealisateurDTO realisateur;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitre() {
		return titre;
	}

	public void setTitre(String titre) {
		this.titre = titre;
	}

	public int getDuree() {
		return duree;
	}

	public void setDuree(int duree) {
		this.duree = duree;
	}

	public RealisateurDTO getRealisateur() {
        return realisateur;
    }

    public void setRealisateur(RealisateurDTO realisateur) {
        this.realisateur = realisateur;
    }
    
    public LocalDate getDateSortie() {
		return dateSortie;
	}

	public void setDateSortie(LocalDate dateSortie) {
		this.dateSortie = dateSortie;
	}

	public String getPosterUrl() {
		return posterUrl;
	}

	public void setPosterUrl(String posterUrl) {
		this.posterUrl = posterUrl;
	}
	
	public LocalDateTime getDateAjout() {
		return dateAjout;
	}

	public void setDateAjout(LocalDateTime dateAjout) {
		this.dateAjout = dateAjout;
	}
	
	public String getWatchProviders() {
		return watchProviders;
	}

	public void setWatchProviders(String watchProviders) {
		this.watchProviders = watchProviders;
	}
	
	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}
	
	public String getSynopsis() {
		return synopsis;
	}

	public void setSynopsis(String synopsis) {
		this.synopsis = synopsis;
	}
	
	@Override
public String toString() {
    return "FilmDTO [id=" + id + ", titre=" + titre + ", duree=" + duree + ", dateSortie=" + dateSortie + ", posterUrl=" + posterUrl + ", realisateur=" + realisateur + "]";
}

}
