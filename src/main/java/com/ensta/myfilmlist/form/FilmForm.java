package com.ensta.myfilmlist.form;

import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

/**
 * Contient les donnees pour requeter un film.
 */
public class FilmForm {

	// Le titre est non nul et non vide
    @NotBlank(message = "Le titre ne doit pas être vide.")
    private String titre;
    
    // Champs pour film personnalisé
    private Integer duree;
    private LocalDate dateSortie;
    private String realisateurNom;
    private String realisateurPrenom;
    private String posterUrl;
    private String trailerUrl;
    private Boolean isCustom;

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

}
