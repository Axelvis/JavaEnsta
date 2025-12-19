
package com.ensta.myfilmlist.model;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.OneToMany;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "Realisateur")
public class Realisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nom;
    private String prenom;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;
    private boolean celebre;

    @OneToMany(
        mappedBy = "realisateur",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @JsonBackReference
    private List<Film> filmsRealises;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public List<Film> getFilmsRealises() {
        return filmsRealises;
    }

    public void setFilmsRealises(List<Film> filmRealises) {
        this.filmsRealises = filmRealises;
    }

    public boolean isCelebre() {
        return celebre;
    }

    public void setCelebre(boolean celebre) {
        this.celebre = celebre;
    }
}