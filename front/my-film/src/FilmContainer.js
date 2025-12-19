import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilmList from './FilmList';
import CreateFilmForm from './CreateFilmForm';
import FilmFilter from './FilmFilter';
import { getAllFilms, postFilm, deleteFilm, putFilm } from './api/FilmApi';

export default function FilmContainer() {
    const [films, setFilms] = useState([]);
    const [open, setOpen] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [editingFilm, setEditingFilm] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('titre-asc');

    // Fonction pour charger les films depuis le backend
    const fetchFilms = () => {
        getAllFilms()
            .then(response => {
                setFilms(response.data);
            })
            .catch(err => console.error("Erreur chargement films", err));
    };

    // Charger la liste au montage du composant
    useEffect(() => {
        fetchFilms();
    }, []);

    // Gestion de la création
    const handleCreateFilm = (newFilm) => {
        postFilm(newFilm)
            .then(() => {
                fetchFilms(); // Rafraichir la liste après création
                setOpenCreate(false); // Fermer le dialog
            })
            .catch(err => console.error("Erreur création", err));
    };

    // Gestion de la suppression [cite: 158]
    const handleDeleteFilm = (id) => {
        deleteFilm(id)
            .then(() => {
                fetchFilms(); // Rafraichir la liste après suppression
            })
            .catch(err => console.error("Erreur suppression", err));
    };

    const handleOpenEdit = (film) => {
        setEditingFilm(film);
        setOpen(true);
    };

    const handleCloseEdit = () => {
        setOpen(false);
        setEditingFilm(null);
    };

    const handleUpdateFilm = (film) => {
        putFilm(film)
            .then(() => {
                fetchFilms();
                handleCloseEdit();
            })
            .catch(err => console.error("Erreur mise à jour", err));
    };

    // Filtrer les films selon le terme de recherche
    const filteredFilms = films.filter(film => {
        const searchLower = searchTerm.toLowerCase();
        return (
            film.titre.toLowerCase().includes(searchLower) ||
            (film.realisateur && film.realisateur.nom && 
             film.realisateur.nom.toLowerCase().includes(searchLower)) ||
            (film.realisateur && film.realisateur.prenom && 
             film.realisateur.prenom.toLowerCase().includes(searchLower))
        );
    });

    // Trier les films selon l'option choisie
    const sortedFilms = [...filteredFilms].sort((a, b) => {
        switch(sortOption) {
            case 'titre-asc':
                return a.titre.localeCompare(b.titre, 'fr', { sensitivity: 'base' });
            case 'titre-desc':
                return b.titre.localeCompare(a.titre, 'fr', { sensitivity: 'base' });
            case 'realisateur-asc':
                const nomA = a.realisateur ? `${a.realisateur.nom} ${a.realisateur.prenom}` : '';
                const nomB = b.realisateur ? `${b.realisateur.nom} ${b.realisateur.prenom}` : '';
                return nomA.localeCompare(nomB, 'fr', { sensitivity: 'base' });
            case 'realisateur-desc':
                const nomA2 = a.realisateur ? `${a.realisateur.nom} ${a.realisateur.prenom}` : '';
                const nomB2 = b.realisateur ? `${b.realisateur.nom} ${b.realisateur.prenom}` : '';
                return nomB2.localeCompare(nomA2, 'fr', { sensitivity: 'base' });
            case 'duree-asc':
                return (a.duree || 0) - (b.duree || 0);
            case 'duree-desc':
                return (b.duree || 0) - (a.duree || 0);
            case 'dateAjout-asc':
                // Plus ancien d'abord (tri croissant)
                if (!a.dateAjout) return 1; // Les films sans date à la fin
                if (!b.dateAjout) return -1;
                return new Date(a.dateAjout) - new Date(b.dateAjout);
            case 'dateAjout-desc':
                // Plus récent d'abord (tri décroissant)
                if (!a.dateAjout) return 1; // Les films sans date à la fin
                if (!b.dateAjout) return -1;
                return new Date(b.dateAjout) - new Date(a.dateAjout);
            default:
                return 0;
        }
    });

    return (
        <div>
            {/* Composant de filtrage et de tri */}
            <FilmFilter 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortOption={sortOption}
                onSortChange={setSortOption}
            />
            
            {/* On passe la liste filtrée et triée */}
            <FilmList films={sortedFilms} onDelete={handleDeleteFilm} onEdit={handleOpenEdit} />

            {/* Bouton flottant pour créer un film */}
            <Fab 
                color="primary" 
                aria-label="add"
                onClick={() => setOpenCreate(true)}
                sx={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    width: 70,
                    height: 70
                }}
            >
                <AddIcon sx={{ fontSize: 35 }} />
            </Fab>

            {/* Dialog pour créer un film */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Créer un nouveau film</DialogTitle>
                <DialogContent>
                    <CreateFilmForm onSubmit={handleCreateFilm} />
                </DialogContent>
            </Dialog>

            {/* Dialog pour éditer un film */}
            <Dialog open={open} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                <DialogTitle>Editer un film</DialogTitle>
                <DialogContent>
                    <CreateFilmForm film={editingFilm} onSubmit={handleUpdateFilm} />
                </DialogContent>
            </Dialog>
        </div>
    );
}