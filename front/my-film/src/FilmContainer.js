import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import FilmList from './FilmList';
import CreateFilmForm from './CreateFilmForm';
import { getAllFilms, postFilm, deleteFilm, putFilm } from './api/FilmApi';

export default function FilmContainer() {
    const [films, setFilms] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingFilm, setEditingFilm] = useState(null);

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

    return (
        <div>
            {/* On passe la fonction de création au formulaire */}
            <CreateFilmForm onSubmit={handleCreateFilm} />
            
            {/* On passe la liste et la fonction de suppression à la liste */}
            <FilmList films={films} onDelete={handleDeleteFilm} onEdit={handleOpenEdit} />

            <Dialog open={open} onClose={handleCloseEdit}>
                <DialogTitle>Editer un film</DialogTitle>
                <DialogContent>
                    <CreateFilmForm film={editingFilm} onSubmit={handleUpdateFilm} />
                </DialogContent>
            </Dialog>
        </div>
    );
}