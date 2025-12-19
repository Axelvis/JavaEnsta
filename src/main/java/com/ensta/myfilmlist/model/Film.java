package com.ensta.myfilmlist.model;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Film")
public class Film {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private String titre;
	private int duree;
	
	@Column(name = "date_sortie")
	private LocalDate dateSortie;
	
	@Column(name = "poster_url", length = 500)
	private String posterUrl;
	
	@Column(name = "date_ajout")
	private LocalDateTime dateAjout;
	
	@Column(name = "watch_providers", length = 2000)
	private String watchProviders;
	
	@Column(name = "rating")
	private Double rating;
	
	@Column(name = "synopsis", columnDefinition = "TEXT")
	private String synopsis;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "realisateur_id", nullable = true, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	@JsonManagedReference
	private Realisateur realisateur;

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

}
