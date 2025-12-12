package com.ensta.myfilmlist.form;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;

/**
 * Contient les donnees pour requeter un film.
 */
public class FilmForm {

	// Le titre est non nul et non vide
    @NotBlank(message = "Le titre ne doit pas être vide.")
    private String titre;
    
    // La durée doit être strictement positive (minimum 1)
    @Positive(message = "La durée doit être strictement positive.")
    // Alternative possible (si Positive n'est pas disponible ou si on veut être explicite): @Min(value = 1, message = "La durée doit être supérieure à zéro.")
    private Integer duree;
    
    // L'ID du réalisateur doit être strictement positif (ID > 0)
    @Min(value = 1, message = "L'ID du réalisateur doit être supérieur à zéro.")
    private Long realisateurId;

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

	public long getRealisateurId() {
		return realisateurId;
	}

	public void setRealisateurId(long realisateurId) {
		this.realisateurId = realisateurId;
	}

}
