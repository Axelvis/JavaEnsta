package com.ensta.myfilmlist;

// Imports
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ensta.myfilmlist.model.Film;
import com.ensta.myfilmlist.model.Realisateur;
import com.ensta.myfilmlist.service.MyFilmsService;
import com.ensta.myfilmlist.service.impl.MyFilmsServiceImpl;
import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.dto.FilmDTO;
import com.ensta.myfilmlist.dto.RealisateurDTO;
import com.ensta.myfilmlist.form.FilmForm;

/**
 * Classe de tests du service MyFilmsServiceImpl.
 */
@Component
public class MyfilmlistTests {

	/** Initialisation du service pour les traitements de l'application MyFilms */
	@Autowired
	private MyFilmsService myFilmsService = new MyFilmsServiceImpl();

	/**
	 * Permet de tester la mise a jour du statut "celebre" d'un RealisateurDTO en fonction du nombre de films realises.
	 */
	public void updateRealisateurCelebreTest() {
		// Creation des Realisateurs

		Realisateur jamesCameron = new Realisateur();
		jamesCameron.setNom("Cameron");
		jamesCameron.setPrenom("James");
		jamesCameron.setDateNaissance(LocalDate.of(1954, 8, 16));

		Realisateur peterJackson = new Realisateur();
		peterJackson.setNom("Jackson");
		peterJackson.setPrenom("Peter");
		peterJackson.setDateNaissance(LocalDate.of(1961, 10, 31));

		// Creation des films

		Film avatar = new Film();
		avatar.setTitre("Avatar");
		avatar.setDuree(162);
		avatar.setRealisateur(jamesCameron);

		Film laCommunauteDeLAnneau = new Film();
		laCommunauteDeLAnneau.setTitre("La communauté de l'anneau");
		laCommunauteDeLAnneau.setDuree(178);
		laCommunauteDeLAnneau.setRealisateur(peterJackson);

		Film lesDeuxTours = new Film();
		lesDeuxTours.setTitre("Les deux tours");
		lesDeuxTours.setDuree(179);
		lesDeuxTours.setRealisateur(peterJackson);

		Film leRetourDuRoi = new Film();
		leRetourDuRoi.setTitre("Le retour du roi");
		leRetourDuRoi.setDuree(201);
		leRetourDuRoi.setRealisateur(peterJackson);

		// Affectation des films aux realisateurs

		List<Film> peterJacksonFilms = new ArrayList<>();
		peterJacksonFilms.add(laCommunauteDeLAnneau);
		peterJacksonFilms.add(lesDeuxTours);
		peterJacksonFilms.add(leRetourDuRoi);
		peterJackson.setFilmsRealises(peterJacksonFilms);

		List<Film> jamesCameronFilms = new ArrayList<>();
		jamesCameronFilms.add(avatar);
		jamesCameron.setFilmsRealises(jamesCameronFilms);

		// Mise a jour du statut "celebre" des Realisateurs

		try {
			jamesCameron = myFilmsService.updateRealisateurCelebre(jamesCameron);
			peterJackson = myFilmsService.updateRealisateurCelebre(peterJackson);

			// Attendue : false
			System.out.println("James Cameron est-il celebre ? " + jamesCameron.isCelebre());
			// Attendue : true
			System.out.println("Peter Jackson est-il celebre ? " + peterJackson.isCelebre());
		} catch (ServiceException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * Permet de tester le calcul de la duree totale des films.
	 */
	public void calculerDureeTotaleTest() {
		// Creation des films

		Film laCommunauteDeLAnneau = new Film();
		laCommunauteDeLAnneau.setTitre("La communauté de l'anneau");
		laCommunauteDeLAnneau.setDuree(178);

		Film lesDeuxTours = new Film();
		lesDeuxTours.setTitre("Les deux tours");
		lesDeuxTours.setDuree(179);

		Film leRetourDuRoi = new Film();
		leRetourDuRoi.setTitre("Le retour du roi");
		leRetourDuRoi.setDuree(201);

		List<Film> leSeigneurDesAnneaux = new ArrayList<>();
		leSeigneurDesAnneaux.add(laCommunauteDeLAnneau);
		leSeigneurDesAnneaux.add(lesDeuxTours);
		leSeigneurDesAnneaux.add(leRetourDuRoi);

		// Calcule de la duree totale

		long dureeTotale = myFilmsService.calculerDureeTotale(leSeigneurDesAnneaux);
		// Attendue : 558 minutes
		System.out.println("La duree totale de la trilogie \"Le Seigneur des Anneaux\" est de : " + dureeTotale + " minutes");
	}

	/**
	 * Permet de tester le calcul de la note moyenne des films.
	 */
	public void calculerNoteMoyenneTest() {
		// Creation des notes

		double[] notes = { 18, 15.5, 12 };

		// Calcul de la note moyenne

		double noteMoyenne = myFilmsService.calculerNoteMoyenne(notes);

		// Attendue : 15,17
		System.out.println("La note moyenne est : " + noteMoyenne);
	}
	
	public void updateRealisateurCelebresTest() {

    // Création des réalisateurs

    Realisateur jamesCameron = new Realisateur();
    jamesCameron.setNom("Cameron");
    jamesCameron.setPrenom("James");
    jamesCameron.setDateNaissance(LocalDate.of(1954, 8, 16));

    Realisateur peterJackson = new Realisateur();
    peterJackson.setNom("Jackson");
    peterJackson.setPrenom("Peter");
    peterJackson.setDateNaissance(LocalDate.of(1961, 10, 31));

    // Films de Peter Jackson (3 films → célèbre)
    List<Film> filmsJackson = new ArrayList<>();
    filmsJackson.add(new Film()); filmsJackson.get(0).setDuree(100);
    filmsJackson.add(new Film()); filmsJackson.get(1).setDuree(120);
    filmsJackson.add(new Film()); filmsJackson.get(2).setDuree(140);
    peterJackson.setFilmsRealises(filmsJackson);

    // Films de James Cameron (1 film → pas célèbre)
    List<Film> filmsCameron = new ArrayList<>();
    filmsCameron.add(new Film()); filmsCameron.get(0).setDuree(150);
    jamesCameron.setFilmsRealises(filmsCameron);

    // Liste à tester
    List<Realisateur> realisateurs = new ArrayList<>();
    realisateurs.add(jamesCameron);
    realisateurs.add(peterJackson);

    try {
        // Appel du service
        List<Realisateur> celebres = myFilmsService.updateRealisateurCelebres(realisateurs);

        // Attendu : Réalisateurs célèbres : Peter Jackson
        System.out.println("Réalisateurs célèbres : ");
        celebres.forEach(r -> System.out.println(r.getPrenom() + " " + r.getNom()));

    } catch (ServiceException e) {
        e.printStackTrace();
    }
}
	/**
	 * Permet de tester la recuperation des films.
	 */
	public void findAllFilmsTest() {
		try {
			List<FilmDTO> films = myFilmsService.findAllFilms();

			// Attendue : 4
			System.out.println("Combien y a-t-il de films ? " + films.size());

			films.forEach(System.out::println);
		} catch (ServiceException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Permet de tester la creation des films.
	 */
	public void createFilmTest() {
		try {
			RealisateurDTO realisateur = myFilmsService.findRealisateurByNomAndPrenom("Cameron", "James");

			FilmForm titanic = new FilmForm();
			titanic.setTitre("Titanic");
			titanic.setDuree(195);
			//titanic.setRealisateurId(realisateurDTO.getId());
			titanic.setRealisateurId(realisateur.getId());

			FilmDTO newFilm = myFilmsService.createFilm(titanic);

			System.out.println("Le nouveau film 'Titanic' possede l'id : " + newFilm.getId());

			List<FilmDTO> films = myFilmsService.findAllFilms();

			// Attendue : 5
			System.out.println("Combien y a-t-il de films ? " + films.size());

			films.forEach(f -> System.out.println("Le realisateur du film : '" + f.getTitre() + "' est : " + f.getRealisateur()));
		} catch (ServiceException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Permet de tester la recuperation d'un film par son identifiant.
	 */
	public void findFilmByIdTest() {
		try {
			FilmDTO avatar = myFilmsService.findFilmById(1);
			System.out.println("Le film avec l'identifiant 1 est : " + avatar);
		} catch (ServiceException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Permet de tester la suppression d'un film avec son identifiant.
	 */
	public void deleteFilmByIdTest() {
		try {
			FilmDTO filmDTO = myFilmsService.findFilmById(5);
			System.out.println("Le film avec l'identifiant 5 est : " + filmDTO);
			myFilmsService.deleteFilm(5);
			filmDTO = myFilmsService.findFilmById(5);

			System.out.println("Suppression du film avec l'identifiant 5...");
			System.out.println("Le film avec l'identifiant 5 est : " + filmDTO);
		} catch (ServiceException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Permet de tester la mise a jour du statut celebre d'un Realisateur.
	 */
	public void updateRealisateurCelebre() {
		try {
			RealisateurDTO realisateurDTO = myFilmsService.findRealisateurByNomAndPrenom("Cameron", "James");
			// Attendue : false
			System.out.println("James Cameron est-il celebre ? " + realisateurDTO.isCelebre());

			FilmForm titanic = new FilmForm();
			titanic.setTitre("Titanic");
			titanic.setDuree(195);
			titanic.setRealisateurId(realisateurDTO.getId());

			FilmForm leHobbit = new FilmForm();
			leHobbit.setTitre("Le Hobbit : Un voyage inattendu");
			leHobbit.setDuree(169);
			leHobbit.setRealisateurId(realisateurDTO.getId());

			myFilmsService.createFilm(titanic);
			FilmDTO leHobbitDTO = myFilmsService.createFilm(leHobbit);

			System.out.println("James Cameron a realise deux nouveaux films");
			realisateurDTO = myFilmsService.findRealisateurByNomAndPrenom("Cameron", "James");

			// Attendue : true
			System.out.println("James Cameron est-il celebre ? " + realisateurDTO.isCelebre());

			myFilmsService.deleteFilm(leHobbitDTO.getId());
			System.out.println("Ce n'est pas James Cameron qui a realise le Hobbit, suppression du film !");
			realisateurDTO = myFilmsService.findRealisateurByNomAndPrenom("Cameron", "James");

			// Attendue : false
			System.out.println("James Cameron est-il celebre ? " + realisateurDTO.isCelebre());
		} catch (ServiceException e) {
			e.printStackTrace();
		}
	}

	/**
 * Test de la création d'un nouveau réalisateur.
 */
public void createRealisateurTest() {
    try {
        // 1. Création du DTO à envoyer
        RealisateurDTO nouveau = new RealisateurDTO();
        nouveau.setNom("Villeneuve");
        nouveau.setPrenom("Denis");
        nouveau.setDateNaissance(LocalDate.of(1967, 10, 3));
        nouveau.setCelebre(false); // par défaut

        // 2. Appel du service
        RealisateurDTO saved = myFilmsService.createRealisateur(nouveau);

        System.out.println("ID du nouveau réalisateur : " + saved.getId());
        System.out.println("Réalisateur sauvegardé : " + saved);

        // 3. Vérification en base
        RealisateurDTO found =
            myFilmsService.findRealisateurDTOById(saved.getId());

        System.out.println("Réalisateur trouvé : " + found);

        // 4. Tests attendus
        if (found == null) {
            System.out.println("Le réalisateur n’a pas été retrouvé !");
            return;
        }
        System.out.println("Nom : " + found.getNom());        // Denis
        System.out.println("Prénom : " + found.getPrenom());  // Villeneuve
        System.out.println("Célèbre ? " + found.isCelebre()); // false
        System.out.println("Test de création du réalisateur succès");

    } catch (ServiceException e) {
        e.printStackTrace();
    }
}

}
