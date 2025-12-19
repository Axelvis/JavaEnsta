package com.ensta.myfilmlist.form;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;

public class FilmForm {

    @NotBlank(message = "Le titre ne doit pas être vide.")
    private String titre;
    
    @Positive(message = "La durée doit être strictement positive.")
    private Integer duree;
    
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
