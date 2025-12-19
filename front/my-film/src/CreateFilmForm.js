import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Autocomplete, CircularProgress, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getAllFilms } from './api/FilmApi';

const TMDB_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTY5YWU2ZTY0OGYwNGFiMjNlMzFmNTM0ZjliNWY0NyIsIm5iZiI6MTc2NTUzODAxNC43MzgsInN1YiI6IjY5M2JmOGRlNmRlZTkzMGZhOGNiMDA2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iRG_qZ3aUYTg9DVRr1mdqO0OVC8qbSaTeyPwwxFPsuk";

export default function CreateFilmForm(props) {
    const initialData = props.film || props.initialValues || {};
    const [titre, setTitre] = useState(initialData.titre || '');
    const [tmdbOptions, setTmdbOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [openCustomDialog, setOpenCustomDialog] = useState(false);
    const [existingFilms, setExistingFilms] = useState([]);
    const inputRef = useRef(null);
    
    // Champs pour le formulaire personnalisé
    const [customTitre, setCustomTitre] = useState('');
    const [customDuree, setCustomDuree] = useState('');
    const [customDateSortie, setCustomDateSortie] = useState('');
    const [customRealisateurNom, setCustomRealisateurNom] = useState('');
    const [customRealisateurPrenom, setCustomRealisateurPrenom] = useState('');
    const [customPosterUrl, setCustomPosterUrl] = useState('');
    const [customTrailerUrl, setCustomTrailerUrl] = useState('');

    // Mettre à jour les champs quand le film à éditer change
    useEffect(() => {
        if (props.film) {
            setTitre(props.film.titre || '');
        }
    }, [props.film]);

    // Charger la liste des films existants au montage
    useEffect(() => {
        getAllFilms()
            .then(response => {
                setExistingFilms(response.data);
            })
            .catch(err => console.error("Erreur chargement films existants", err));
    }, []);

    // Auto-focus sur le champ au montage du composant
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Recherche TMDB en temps réel
    useEffect(() => {
        if (!titre || titre.length < 2) {
            setTmdbOptions([]);
            return;
        }

        const searchTimeout = setTimeout(async () => {
            setLoading(true);
            try {
                const query = encodeURIComponent(titre);
                const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=fr-FR&page=1`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
                        'accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Filtrer les films qui existent déjà dans la base (sauf en mode édition)
                    const films = data.results.slice(0, 10)
                        .filter(movie => {
                            // En mode édition, ne pas filtrer le film actuel
                            if (props.film && movie.title.toLowerCase() === props.film.titre.toLowerCase()) {
                                return true;
                            }
                            // Sinon, exclure tous les films déjà existants
                            return !existingFilms.some(existingFilm => 
                                existingFilm.titre.toLowerCase() === movie.title.toLowerCase()
                            );
                        })
                        .map(movie => ({
                            id: movie.id,
                            titre: movie.title,
                            originalTitle: movie.original_title,
                            releaseDate: movie.release_date,
                            posterPath: movie.poster_path,
                            fromTMDB: true
                        }));
                    
                    // Ajouter l'option "Personnaliser" en premier
                    const customOption = {
                        id: 'custom',
                        titre: `Personnaliser "${titre}"`,
                        isCustom: true
                    };
                    
                    setTmdbOptions([customOption, ...films]);
                } else {
                    setTmdbOptions([]);
                }
            } catch (error) {
                console.error('Erreur lors de la recherche TMDB:', error);
                setTmdbOptions([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(searchTimeout);
    }, [titre, existingFilms, props.film]);

    const handleSubmit = () => {
        if (!titre.trim()) {
            alert('Veuillez entrer un titre de film');
            return;
        }

        const filmData = {
            titre: titre
        };
        
        // Ajouter l'ID si on est en mode édition
        if (props.film && props.film.id) {
            filmData.id = props.film.id;
        }
        
        props.onSubmit(filmData);
        
        // Reset des champs
        if (!props.film && !props.initialValues) {
            setTitre('');
            setSelectedFilm(null);
            setTmdbOptions([]);
        }
    };
    
    const handleCustomSubmit = () => {
        // Validation des champs obligatoires
        if (!customTitre.trim()) {
            alert('Le titre est obligatoire');
            return;
        }
        if (!customDuree || customDuree <= 0) {
            alert('La durée est obligatoire et doit être supérieure à 0');
            return;
        }
        if (!customDateSortie) {
            alert('La date de sortie est obligatoire');
            return;
        }
        if (!customRealisateurNom.trim() || !customRealisateurPrenom.trim()) {
            alert('Le nom et prénom du réalisateur sont obligatoires');
            return;
        }
        
        const customFilmData = {
            titre: customTitre,
            duree: parseInt(customDuree),
            dateSortie: customDateSortie,
            realisateurNom: customRealisateurNom,
            realisateurPrenom: customRealisateurPrenom,
            posterUrl: customPosterUrl.trim() || null,
            trailerUrl: customTrailerUrl.trim() || null,
            isCustom: true
        };
        
        props.onSubmit(customFilmData);
        
        // Fermer le dialog et reset
        setOpenCustomDialog(false);
        resetCustomForm();
        setTitre('');
        setTmdbOptions([]);
    };
    
    const resetCustomForm = () => {
        setCustomTitre('');
        setCustomDuree('');
        setCustomDateSortie('');
        setCustomRealisateurNom('');
        setCustomRealisateurPrenom('');
        setCustomPosterUrl('');
        setCustomTrailerUrl('');
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px', margin: '0 auto' }}>
            <Autocomplete
                freeSolo
                options={tmdbOptions}
                loading={loading}
                inputValue={titre}
                onInputChange={(event, newInputValue) => {
                    setTitre(newInputValue);
                }}
                onChange={(event, newValue) => {
                    if (newValue && newValue.isCustom) {
                        // Ouvrir le dialog de personnalisation
                        setCustomTitre(titre);
                        setOpenCustomDialog(true);
                    } else if (newValue && newValue.fromTMDB) {
                        setSelectedFilm(newValue);
                        setTitre(newValue.titre);
                    } else {
                        setSelectedFilm(null);
                    }
                }}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return option.titre;
                }}
                renderOption={(props, option) => {
                    if (option.isCustom) {
                        return (
                            <Box component="li" {...props} sx={{ display: 'flex', gap: 2, alignItems: 'center', backgroundColor: '#fff3e0', fontWeight: 'bold' }}>
                                <Typography variant="body1" color="primary">
                                    ✏️ {option.titre}
                                </Typography>
                            </Box>
                        );
                    }
                    
                    return (
                        <Box component="li" {...props} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            {option.posterPath && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w92${option.posterPath}`}
                                    alt={option.titre}
                                    style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            )}
                            <Box>
                                <Typography variant="body1">{option.titre}</Typography>
                                {option.releaseDate && (
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(option.releaseDate).getFullYear()}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Titre du film"
                        placeholder="Ex: Avatar, Inception, Interstellar..."
                        inputRef={inputRef}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                noOptionsText={titre.length < 2 ? "Tapez au moins 2 caractères" : "Aucun film trouvé sur TMDB"}
            />

            {selectedFilm && (
                <Box sx={{ padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                    <Typography variant="body2" color="primary">
                        Film TMDB sélectionné : {selectedFilm.titre} ({selectedFilm.releaseDate ? new Date(selectedFilm.releaseDate).getFullYear() : 'N/A'})
                    </Typography>
                </Box>
            )}

            <Button variant="contained" onClick={handleSubmit} disabled={!selectedFilm}>
                {(props.film || props.initialValues) ? "Modifier" : "Ajouter le film"}
            </Button>
            
            {/* Dialog pour film personnalisé */}
            <Dialog 
                open={openCustomDialog} 
                onClose={() => setOpenCustomDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Créer un film personnalisé</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                        <TextField
                            label="Titre *"
                            value={customTitre}
                            onChange={(e) => setCustomTitre(e.target.value)}
                            fullWidth
                            required
                        />
                        
                        <TextField
                            label="Durée (en minutes) *"
                            type="number"
                            value={customDuree}
                            onChange={(e) => setCustomDuree(e.target.value)}
                            fullWidth
                            required
                            inputProps={{ min: 1 }}
                        />
                        
                        <TextField
                            label="Date de sortie *"
                            type="date"
                            value={customDateSortie}
                            onChange={(e) => setCustomDateSortie(e.target.value)}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Nom du réalisateur *"
                                value={customRealisateurNom}
                                onChange={(e) => setCustomRealisateurNom(e.target.value)}
                                fullWidth
                                required
                            />
                            
                            <TextField
                                label="Prénom du réalisateur *"
                                value={customRealisateurPrenom}
                                onChange={(e) => setCustomRealisateurPrenom(e.target.value)}
                                fullWidth
                                required
                            />
                        </Box>
                        
                        <TextField
                            label="URL de l'affiche (facultatif)"
                            value={customPosterUrl}
                            onChange={(e) => setCustomPosterUrl(e.target.value)}
                            fullWidth
                            placeholder="https://example.com/poster.jpg"
                        />
                        
                        <TextField
                            label="URL de la bande-annonce (facultatif)"
                            value={customTrailerUrl}
                            onChange={(e) => setCustomTrailerUrl(e.target.value)}
                            fullWidth
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        
                        <Typography variant="caption" color="text.secondary">
                            * Champs obligatoires
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenCustomDialog(false);
                        resetCustomForm();
                    }}>
                        Annuler
                    </Button>
                    <Button onClick={handleCustomSubmit} variant="contained">
                        Créer le film
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
