package com.ensta.myfilmlist;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ensta.myfilmlist.dao.FilmDAO;
import com.ensta.myfilmlist.dao.RealisateurDAO;
import com.ensta.myfilmlist.dto.FilmDTO;
import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.form.FilmForm;
import com.ensta.myfilmlist.model.Film;
import com.ensta.myfilmlist.model.Realisateur;
import com.ensta.myfilmlist.service.impl.MyFilmsServiceImpl;

@ExtendWith(MockitoExtension.class)
public class FilmServiceTests {

    @Mock
    private FilmDAO filmDAO;

    @Mock
    private RealisateurDAO realisateurDAO;

    @InjectMocks
    private MyFilmsServiceImpl myFilmsService;

    /**
     * NIVEAU : RAPIDE
     * Teste la méthode purement algorithmique calculerNoteMoyenne (Partie 1).
     */
    @Test
    public void calculerNoteMoyenneTest() {
        double[] notes = {10.0, 15.0, 20.0};
        double moyenne = myFilmsService.calculerNoteMoyenne(notes);
        assertEquals(15.0, moyenne);
        
        double[] notesVides = {};
        assertEquals(0.0, myFilmsService.calculerNoteMoyenne(notesVides));
    }

    /**
     * NIVEAU : MOYEN
     * Teste la récupération de tous les films via le mock.
     */
    @Test
    public void findAllFilmsTest() throws ServiceException {
        // Préparation du Mock
        List<Film> filmsMock = new ArrayList<>();
        Film f = new Film(); 
        f.setId(1L); f.setTitre("Mock Film"); 
        // Important pour le mapper : mettre un Realisateur vide
        f.setRealisateur(new Realisateur()); 
        filmsMock.add(f);

        when(filmDAO.findAll()).thenReturn(filmsMock);

        // Appel du service
        List<FilmDTO> result = myFilmsService.findAllFilms();

        // Vérifications
        assertEquals(1, result.size());
        assertEquals("Mock Film", result.get(0).getTitre());
        verify(filmDAO, times(1)).findAll();
    }

    /**
     * NIVEAU : DIFFICILE
     * Teste la création d'un film (logique complexe avec vérification réalisateur).
     */
    @Test
    public void createFilmTest_Success() throws ServiceException {
        // 1. Données d'entrée
        FilmForm form = new FilmForm();
        form.setTitre("New Movie");
        form.setDuree(100);
        form.setRealisateurId(1L);

        // 2. Mocks
        Realisateur realisateurMock = new Realisateur();
        realisateurMock.setId(1L);
        realisateurMock.setNom("Nolan");
        
        // Le DAO Realisateur doit renvoyer le réalisateur quand on le cherche
        when(realisateurDAO.findById(1L)).thenReturn(Optional.of(realisateurMock));
        
        // Le DAO Film doit renvoyer le film sauvegardé avec un ID généré
        when(filmDAO.create(any(Film.class))).thenAnswer(invocation -> {
            Film filmToSave = invocation.getArgument(0);
            filmToSave.setId(10L); // Simule l'ID généré
            return filmToSave;
        });

        // 3. Exécution
        FilmDTO result = myFilmsService.createFilm(form);

        // 4. Assertions
        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("New Movie", result.getTitre());
        
        // Vérifie que le service a bien vérifié l'existence du réalisateur
        verify(realisateurDAO).findById(1L);
        // Vérifie que le service a bien appelé save
        verify(filmDAO).create(any(Film.class));
    }

    /**
     * Teste le cas où le réalisateur n'existe pas (Doit lever une exception).
     */
/**
     * Teste le cas où le réalisateur n'existe pas (Doit lever une exception).
     */
    @Test
    public void createFilmTest_RealisateurNotFound() throws ServiceException {
        // 1. Données
        FilmForm form = new FilmForm();
        form.setTitre("Film Test"); // Important pour éviter d'autres erreurs potentielles
        form.setDuree(120);
        form.setRealisateurId(99L); 

        // 2. Mock : On dit que le réalisateur 99 n'existe pas
        // NOTE : On ne mocke PAS filmDAO.save() ici, car le code n'ira jamais jusque-là !
        when(realisateurDAO.findById(99L)).thenReturn(Optional.empty());

        // 3. Exécution & Vérification
        assertThrows(ServiceException.class, () -> {
            myFilmsService.createFilm(form);
        });
        
        // 4. Vérification optionnelle : on s'assure que le save n'a JAMAIS été appelé
        verify(filmDAO, never()).create(any());
    }
}