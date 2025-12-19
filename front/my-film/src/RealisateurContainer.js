import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ViewSwitcher from './ViewSwitcher';
import RealisateurCard from './RealisateurCard';
import FilmCard from './FilmCard';
import { getAllRealisateurs } from './api/RealisateurApi';
import { getAllFilms, deleteFilm, putFilm } from './api/FilmApi';

export default function RealisateurContainer({ currentView, onViewChange, onFilmClick, onRealisateurClick, currentPopup, onClosePopup }) {
    const [realisateurs, setRealisateurs] = useState([]);
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('nom-asc');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [realisateursResponse, filmsResponse] = await Promise.all([
                getAllRealisateurs(),
                getAllFilms()
            ]);
            setRealisateurs(realisateursResponse.data);
            setFilms(filmsResponse.data);
            console.log('Realisateurs:', realisateursResponse.data);
            console.log('Films:', filmsResponse.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFilm = (id) => {
        deleteFilm(id)
            .then(() => loadData())
            .catch(err => console.error("Erreur suppression", err));
    };

    const handleOpenEdit = (film) => {
        // Édition non implémentée dans la vue réalisateurs
        console.log('Édition non disponible depuis cette vue');
    };

    // Filtrer les réalisateurs selon le terme de recherche
    const filteredRealisateurs = realisateurs.filter(realisateur => {
        const searchLower = searchTerm.toLowerCase();
        return (
            realisateur.nom.toLowerCase().includes(searchLower) ||
            realisateur.prenom.toLowerCase().includes(searchLower)
        );
    });

    // Trier les réalisateurs selon l'option choisie
    const sortedRealisateurs = [...filteredRealisateurs].sort((a, b) => {
        switch(sortOption) {
            case 'nom-asc':
                return `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`, 'fr', { sensitivity: 'base' });
            case 'nom-desc':
                return `${b.nom} ${b.prenom}`.localeCompare(`${a.nom} ${a.prenom}`, 'fr', { sensitivity: 'base' });
            case 'note-asc':
                const avgA = films.filter(f => f.realisateur?.id === a.id && f.rating != null).length > 0
                    ? films.filter(f => f.realisateur?.id === a.id && f.rating != null).reduce((sum, f) => sum + f.rating, 0) / films.filter(f => f.realisateur?.id === a.id && f.rating != null).length
                    : 0;
                const avgB = films.filter(f => f.realisateur?.id === b.id && f.rating != null).length > 0
                    ? films.filter(f => f.realisateur?.id === b.id && f.rating != null).reduce((sum, f) => sum + f.rating, 0) / films.filter(f => f.realisateur?.id === b.id && f.rating != null).length
                    : 0;
                return avgA - avgB;
            case 'note-desc':
                const avgA2 = films.filter(f => f.realisateur?.id === a.id && f.rating != null).length > 0
                    ? films.filter(f => f.realisateur?.id === a.id && f.rating != null).reduce((sum, f) => sum + f.rating, 0) / films.filter(f => f.realisateur?.id === a.id && f.rating != null).length
                    : 0;
                const avgB2 = films.filter(f => f.realisateur?.id === b.id && f.rating != null).length > 0
                    ? films.filter(f => f.realisateur?.id === b.id && f.rating != null).reduce((sum, f) => sum + f.rating, 0) / films.filter(f => f.realisateur?.id === b.id && f.rating != null).length
                    : 0;
                return avgB2 - avgA2;
            default:
                return 0;
        }
    });

    return (
        <div>
            {/* Barre de navigation et filtres */}
            <Box sx={{ 
                padding: '20px', 
                margin: '0 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                {/* View Switcher à gauche */}
                <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />

                {/* Recherche et tri à droite */}
                <Box sx={{ 
                    backgroundColor: 'background.paper', 
                    borderRadius: '8px',
                    padding: '20px',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <TextField
                        label="Rechercher un réalisateur"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ minWidth: '300px', flex: 1 }}
                        placeholder="Nom, prénom..."
                    />
                    
                    <FormControl sx={{ minWidth: '250px' }}>
                        <InputLabel>Trier par</InputLabel>
                        <Select
                            value={sortOption}
                            label="Trier par"
                            onChange={(e) => setSortOption(e.target.value)}
                            sx={{ textAlign: 'left' }}
                            MenuProps={{
                                anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                },
                                transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left',
                                },
                            }}
                        >
                            <MenuItem value="nom-asc">Nom (A → Z)</MenuItem>
                            <MenuItem value="nom-desc">Nom (Z → A)</MenuItem>
                            <MenuItem value="note-desc">Note moyenne (Meilleure)</MenuItem>
                            <MenuItem value="note-asc">Note moyenne (Moins bonne)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                        justifyContent: 'flex-start',
                        ml: '20px',
                        mt: 3
                    }}
                >
                    {sortedRealisateurs.map(realisateur => (
                        <RealisateurCard
                            key={realisateur.id}
                            realisateur={realisateur}
                            films={films}
                            onFilmClick={onFilmClick}
                        />
                    ))}
                </Box>
            )}

            {/* Popup géré par la pile */}
            {currentPopup && currentPopup.type === 'film' && (() => {
                const currentFilm = films.find(f => f.id === currentPopup.id);
                return currentFilm ? (
                    <FilmCard
                        film={currentFilm}
                        isPopupMode={true}
                        onClose={onClosePopup}
                        onDelete={handleDeleteFilm}
                        onEdit={handleOpenEdit}
                        onRatingChange={loadData}
                        onRealisateurClick={onRealisateurClick}
                    />
                ) : null;
            })()}
            {currentPopup && currentPopup.type === 'realisateur' && (() => {
                const currentRealisateur = realisateurs.find(r => r.id === currentPopup.id);
                return currentRealisateur ? (
                    <RealisateurCard
                        realisateur={currentRealisateur}
                        films={films}
                        isPopupMode={true}
                        onClose={onClosePopup}
                        onFilmClick={onFilmClick}
                    />
                ) : null;
            })()}
        </div>
    );
}
