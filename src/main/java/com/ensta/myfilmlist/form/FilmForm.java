package com.ensta.myfilmlist.form;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Min;
import java.time.LocalDate;

public class FilmForm {

    @NotBlank(message = "Le titre ne doit pas être vide.")
    private String titre;
    
    private Integer duree;
    
    private Long realisateurId;
    
    // Champs pour film personnalisé
    private LocalDate dateSortie;
    private String realisateurNom;
    private String realisateurPrenom;
    private LocalDate realisateurDateNaissance;
    private String posterUrl;
    private String trailerUrl;
    private String synopsis;
    private Boolean isCustom;
    private Double rating;

	public String getTitre() {
		return titre;
	}

	public void setTitre(String titre) {
		this.titre = titre;
	}

	public Integer getDuree() {
		return duree;
	}

	public void setDuree(Integer duree) {
		this.duree = duree;
	}

	public LocalDate getDateSortie() {
		return dateSortie;
	}

	public void setDateSortie(LocalDate dateSortie) {
		this.dateSortie = dateSortie;
	}

	public String getRealisateurNom() {
		return realisateurNom;
	}

	public void setRealisateurNom(String realisateurNom) {
		this.realisateurNom = realisateurNom;
	}

	public String getRealisateurPrenom() {
		return realisateurPrenom;
	}

	public void setRealisateurPrenom(String realisateurPrenom) {
		this.realisateurPrenom = realisateurPrenom;
	}

	public String getPosterUrl() {
		return posterUrl;
	}

	public void setPosterUrl(String posterUrl) {
		this.posterUrl = posterUrl;
	}

	public String getTrailerUrl() {
		return trailerUrl;
	}

	public void setTrailerUrl(String trailerUrl) {
		this.trailerUrl = trailerUrl;
	}

	public Boolean getIsCustom() {
		return isCustom;
	}

	public void setIsCustom(Boolean isCustom) {
		this.isCustom = isCustom;
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}
	
	public Long getRealisateurId() {
		return realisateurId;
	}

	public void setRealisateurId(Long realisateurId) {
		this.realisateurId = realisateurId;
	}
	
	public String getSynopsis() {
		return synopsis;
	}

	public void setSynopsis(String synopsis) {
		this.synopsis = synopsis;
	}
	
	public LocalDate getRealisateurDateNaissance() {
		return realisateurDateNaissance;
	}

	public void setRealisateurDateNaissance(LocalDate realisateurDateNaissance) {
		this.realisateurDateNaissance = realisateurDateNaissance;
	}

}
