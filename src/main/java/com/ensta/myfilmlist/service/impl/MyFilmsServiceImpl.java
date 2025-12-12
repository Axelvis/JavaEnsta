package com.ensta.myfilmlist.service.impl;

import com.ensta.myfilmlist.dao.FilmDAO;
import com.ensta.myfilmlist.dao.RealisateurDAO;
import com.ensta.myfilmlist.dao.impl.JdbcFilmDAO;
import com.ensta.myfilmlist.dao.impl.JdbcRealisateurDAO;
import com.ensta.myfilmlist.exception.ServiceException;
import com.ensta.myfilmlist.form.FilmForm;
import com.ensta.myfilmlist.model.Film;
import com.ensta.myfilmlist.model.Realisateur;
import com.ensta.myfilmlist.service.MyFilmsService;
import com.ensta.myfilmlist.dto.FilmDTO;
import com.ensta.myfilmlist.dto.RealisateurDTO;
import com.ensta.myfilmlist.mapper.FilmMapper;
import com.ensta.myfilmlist.mapper.RealisateurDTOMapper;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyFilmsServiceImpl implements MyFilmsService {

    public static final int NB_FILMS_MIN_REALISATEUR_CELEBRE = 3;
    

    @Override
    public Realisateur updateRealisateurCelebre(Realisateur realisateur) throws ServiceException {
        try {

            if (realisateur.getFilmsRealises() == null) {
                throw new ServiceException("La liste des films réalisés ne doit pas être nulle.");
            }

            int nbFilms = realisateur.getFilmsRealises().size();
            boolean estCelebre = nbFilms >= NB_FILMS_MIN_REALISATEUR_CELEBRE;
            realisateur.setCelebre(estCelebre);

            return realisateur;

        } 
        catch (Exception e) {
            throw new ServiceException("Erreur lors de la mise à jour du statut célèbre du réalisateur.", e);
        }
    }

    @Override
    public long calculerDureeTotale(List<Film> films) {
        return films.stream()
            .mapToInt(Film::getDuree)
            .sum();
    }

    @Override
    public double calculerNoteMoyenne(double[] notes) {
        double moyenne = Arrays.stream(notes)
            .average()
            .orElse(0.0);

        double arrondi = Math.pow(10, 2);

        return Math.round(moyenne * arrondi) / arrondi;
    }

    @Override
    public List<Realisateur> updateRealisateurCelebres(List<Realisateur> realisateurs) throws ServiceException {
        try {
            return realisateurs.stream()
                    .peek(r -> r.setCelebre(r.getFilmsRealises().size() >= NB_FILMS_MIN_REALISATEUR_CELEBRE))
                    .filter(Realisateur::isCelebre)
                    .toList();

        } catch (Exception e) {
            throw new ServiceException("Erreur lors de la mise à jour des réalisateurs célèbres.", e);
        }
    }
    @Autowired
    private FilmDAO filmDAO = new JdbcFilmDAO();

    @Override
    public List<FilmDTO> findAllFilms() throws ServiceException {
        try {
            List<Film> films = filmDAO.findAll();
            return films.stream()
                    .map(FilmMapper::convertFilmToFilmDTO)
                    .toList();
        } catch (Exception e) {
            throw new ServiceException("Erreur lors de la récupération de la liste des films.", e);
        }   
    }

    @Override
    public FilmDTO findFilmById(long id) throws ServiceException {
        try {
            Film film = filmDAO.findById(id);

            if (film == null) {
                return null;
            }
            return FilmMapper.convertFilmToFilmDTO(film);
        } catch (Exception e) {
            throw new ServiceException("Erreur lors de findFilmById(" + id + ")", e);
        }
    }
    @Autowired
    private RealisateurDAO realisateurDAO = new JdbcRealisateurDAO();

    @Override
    public List<Realisateur> findAllRealisateurs() throws ServiceException {
        try {
            return realisateurDAO.findAll();
        } catch (Exception e) {
            throw new ServiceException("Erreur findAllRealisateurs.", e);
        }
    }

    @Override
    public Optional<Realisateur> findRealisateurById(long id) throws ServiceException {
        try {
            return realisateurDAO.findById(id);
        } catch (Exception e) {
            throw new ServiceException("Erreur lors de findRealisateurById.", e);
        }
    }

    @Override
    public RealisateurDTO findRealisateurByNomAndPrenom(String nom, String prenom) throws ServiceException {
        try {
            Realisateur real = realisateurDAO.findByNomAndPrenom(nom, prenom);

            if (real == null) return null;
            updateRealisateurCelebre(real);
            realisateurDAO.update(real);
            return RealisateurDTOMapper.convertRealisateurToRealisateurDTO(real);

        } catch (Exception e) {
            throw new ServiceException("Erreur findRealisateurByNomAndPrenom.", e);
        }
    }

    @Override
    @Transactional // createFilm et deleteFilm sont transactionnelles pour garantir l'atomicité et la cohérence des opérations.
    public FilmDTO createFilm(FilmForm form) throws ServiceException {
        try {
            Film film = FilmMapper.convertFilmFormToFilm(form);
            Optional<Realisateur> realisateurOpt = realisateurDAO.findById(form.getRealisateurId());
            // Vérification de l'existence du réalisateur
            if (realisateurOpt.isEmpty()) {
                throw new ServiceException("Aucun réalisateur trouvé avec id=" + form.getRealisateurId());
            }
            Realisateur realisateur = realisateurOpt.get();
            film.setRealisateur(realisateur);
            film = filmDAO.create(film);
            List<Film> filmsDuRealisateur = filmDAO.findByRealisateurId(realisateur.getId());
            realisateur.setFilmsRealises(filmsDuRealisateur);
            updateRealisateurCelebre(realisateur);
            realisateurDAO.update(realisateur);

            return FilmMapper.convertFilmToFilmDTO(film);

        } catch (Exception e) {
            throw new ServiceException("Erreur lors de la création du film.", e);
        }
    }

    @Override
    @Transactional
    public void deleteFilm(long id) throws ServiceException {
        try {
            Film film = filmDAO.findById(id);
            if (film == null) {
                return;
            }

            long realisateurId = film.getRealisateurId();

            filmDAO.delete(id);
            Optional<Realisateur> opt = realisateurDAO.findById(realisateurId);
            if (opt.isEmpty()) return;

            Realisateur r = opt.get();

            List<Film> filmsRestants = filmDAO.findByRealisateurId(realisateurId);
            r.setFilmsRealises(filmsRestants);
            updateRealisateurCelebre(r);
            realisateurDAO.update(r);

        } catch (Exception e) {
            throw new ServiceException("Erreur lors de la suppression du film avec id=" + id, e);
        }
    }

    @Override
    public RealisateurDTO createRealisateur(RealisateurDTO dto) throws ServiceException {
        try {
            Realisateur real = RealisateurDTOMapper.convertRealisateurDTOToRealisateur(dto);
            real.setFilmsRealises(List.of());
            real = realisateurDAO.save(real);

            return RealisateurDTOMapper.convertRealisateurToRealisateurDTO(real);

        } catch (Exception e) {
            throw new ServiceException("Erreur lors de la création du réalisateur.", e);
        }
    }

    @Override
    public RealisateurDTO findRealisateurDTOById(long id) throws ServiceException {
        try {
            Optional<Realisateur> opt = realisateurDAO.findById(id);
            if (opt.isEmpty()) return null;

            Realisateur real = opt.get();

            // Mettre à jour la célébrité avant de retourner le DTO
            updateRealisateurCelebre(real);
            realisateurDAO.update(real);

            return RealisateurDTOMapper.convertRealisateurToRealisateurDTO(real);

        } catch (Exception e) {
            throw new ServiceException("Erreur lors de findRealisateurDTOById.", e);
        }
    }

}
