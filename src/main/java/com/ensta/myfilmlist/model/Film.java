package com.ensta.myfilmlist.model;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "Film")
public class Film {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private String titre;
	private int duree;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "realisateur_id")
	@JsonManagedReference
	private Realisateur realisateur;
	
	@Column(name = "realisateur_id", insertable = false, updatable = false)
	private long realisateurId;

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

	public Realisateur getRealisateur() {
		return realisateur;
	}

	public void setRealisateur(Realisateur realisateur) {
		this.realisateur = realisateur;
	}

	public long getRealisateurId() {
    return realisateurId;
	}

	public void setRealisateurId(long realisateurId) {
		this.realisateurId = realisateurId;
	}

}
