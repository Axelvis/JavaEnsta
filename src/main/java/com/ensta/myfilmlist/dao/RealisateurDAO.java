package com.ensta.myfilmlist.dao;

import com.ensta.myfilmlist.model.Realisateur;
import java.util.List;
import java.util.Optional;

public interface RealisateurDAO {
    
    List<Realisateur> findAll(); 
    Optional<Realisateur> findById(long id);
    Realisateur findByNomAndPrenom(String nom, String prenom);
    Realisateur update(Realisateur realisateur);
    Realisateur save(Realisateur realisateur);
}
