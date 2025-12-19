import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Autocomplete, CircularProgress, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getAllFilms } from './api/FilmApi';
import { getAllRealisateurs } from './api/RealisateurApi';

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
    const [customSynopsis, setCustomSynopsis] = useState('');
    const [customPosterUrl, setCustomPosterUrl] = useState('');
    const [customTrailerUrl, setCustomTrailerUrl] = useState('');
    
    // Gestion des réalisateurs
    const [realisateurs, setRealisateurs] = useState([]);
    const [selectedRealisateur, setSelectedRealisateur] = useState(null);
    const [realisateurSearch, setRealisateurSearch] = useState('');
    const [tmdbRealisateurs, setTmdbRealisateurs] = useState([]);
    const [loadingRealisateurs, setLoadingRealisateurs] = useState(false);
    const [customRealisateurNom, setCustomRealisateurNom] = useState('');
    const [customRealisateurPrenom, setCustomRealisateurPrenom] = useState('');
    const [customRealisateurDateNaissance, setCustomRealisateurDateNaissance] = useState('');
    const [isCreatingRealisateur, setIsCreatingRealisateur] = useState(false);

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
    
    // Charger la liste des réalisateurs existants
    useEffect(() => {
        getAllRealisateurs()
            .then(response => {
                setRealisateurs(response.data);
            })
            .catch(err => console.error("Erreur chargement réalisateurs", err));
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
            // Ajouter l'option "Personnaliser" même sans recherche
            if (titre.length > 0) {
                const customOption = {
                    id: 'custom',
                    titre: `Personnaliser "${titre}"`,
                    isCustom: true
                };
                setTmdbOptions([customOption]);
            } else {
                setTmdbOptions([]);
            }
            return;
        }

        const searchTimeout = setTimeout(async () => {
            // Toujours ajouter l'option "Personnaliser" en premier
            const customOption = {
                id: 'custom',
                titre: `Personnaliser "${titre}"`,
                isCustom: true
            };
            
            setLoading(true);
            setTmdbOptions([customOption]); // Afficher immédiatement l'option personnaliser
            
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
                    
                    // Garder l'option "Personnaliser" + résultats TMDB
                    setTmdbOptions([customOption, ...films]);
                } else {
                    // En cas d'erreur API, garder uniquement l'option personnaliser
                    setTmdbOptions([customOption]);
                }
            } catch (error) {
                console.error('Erreur lors de la recherche TMDB:', error);
                // En cas d'erreur, garder uniquement l'option personnaliser
                setTmdbOptions([customOption]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(searchTimeout);
    }, [titre, existingFilms, props.film]);
    
    // Recherche de réalisateurs sur TMDB
    useEffect(() => {
        if (!realisateurSearch || realisateurSearch.length < 2) {
            // Ajouter l'option "Créer" même sans recherche
            if (realisateurSearch.length > 0) {
                const customOption = {
                    id: 'custom',
                    fullName: `✏️ Créer "${realisateurSearch}"`,
                    isCustom: true
                };
                setTmdbRealisateurs([customOption]);
            } else {
                setTmdbRealisateurs([]);
            }
            return;
        }

        const searchTimeout = setTimeout(async () => {
            // Toujours ajouter l'option "Créer un nouveau réalisateur" en premier
            const customOption = {
                id: 'custom',
                fullName: `✏️ Créer "${realisateurSearch}"`,
                isCustom: true
            };
            
            setLoadingRealisateurs(true);
            setTmdbRealisateurs([customOption]); // Afficher immédiatement l'option créer
            
            try {
                const query = encodeURIComponent(realisateurSearch);
                const url = `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=fr-FR&page=1`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
                        'accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Filtrer pour ne garder que les réalisateurs (known_for_department: Directing)
                    const directors = data.results
                        .filter(person => person.known_for_department === 'Directing')
                        .slice(0, 10)
                        .map(person => ({
                            id: person.id,
                            nom: person.name.split(' ').slice(-1)[0] || person.name,
                            prenom: person.name.split(' ').slice(0, -1).join(' ') || person.name,
                            fullName: person.name,
                            fromTMDB: true
                        }));
                    
                    // Garder l'option "Créer" + résultats TMDB
                    setTmdbRealisateurs([customOption, ...directors]);
                } else {
                    // En cas d'erreur API, garder uniquement l'option créer
                    setTmdbRealisateurs([customOption]);
                }
            } catch (error) {
                console.error('Erreur lors de la recherche TMDB réalisateurs:', error);
                // En cas d'erreur, garder uniquement l'option créer
                setTmdbRealisateurs([customOption]);
            } finally {
                setLoadingRealisateurs(false);
            }
        }, 500);

        return () => clearTimeout(searchTimeout);
    }, [realisateurSearch]);

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
        
        // Validation du réalisateur
        if (selectedRealisateur && !selectedRealisateur.isCustom && !selectedRealisateur.fromTMDB) {
            // Réalisateur existant de la base locale - OK
        } else if (isCreatingRealisateur || (selectedRealisateur && selectedRealisateur.isCustom)) {
            // Création d'un nouveau réalisateur
            if (!customRealisateurNom.trim() || !customRealisateurPrenom.trim()) {
                alert('Le nom et prénom du réalisateur sont obligatoires');
                return;
            }
        } else if (selectedRealisateur && selectedRealisateur.fromTMDB) {
            // Réalisateur TMDB - sera créé automatiquement
        } else if (!selectedRealisateur) {
            alert('Veuillez sélectionner ou créer un réalisateur');
            return;
        }
        
        const customFilmData = {
            titre: customTitre,
            duree: parseInt(customDuree),
            dateSortie: customDateSortie,
            synopsis: customSynopsis.trim() || null,
            posterUrl: customPosterUrl.trim() || null,
            trailerUrl: customTrailerUrl.trim() || null,
            isCustom: true
        };
        
        // Ajouter les infos du réalisateur selon le cas
        if (selectedRealisateur && !selectedRealisateur.isCustom && !selectedRealisateur.fromTMDB) {
            // Réalisateur existant de la base locale
            customFilmData.realisateurId = selectedRealisateur.id;
        } else {
            // Nouveau réalisateur à créer (TMDB ou personnalisé)
            customFilmData.realisateurNom = customRealisateurNom;
            customFilmData.realisateurPrenom = customRealisateurPrenom;
            if (customRealisateurDateNaissance) {
                customFilmData.realisateurDateNaissance = customRealisateurDateNaissance;
            }
        }
        
        console.log('Données envoyées:', customFilmData);
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
        setCustomSynopsis('');
        setCustomPosterUrl('');
        setCustomTrailerUrl('');
        setSelectedRealisateur(null);
        setRealisateurSearch('');
        setCustomRealisateurNom('');
        setCustomRealisateurPrenom('');
        setCustomRealisateurDateNaissance('');
        setIsCreatingRealisateur(false);
        setTmdbRealisateurs([]);
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
                noOptionsText={titre.length < 2 ? "Tapez au moins 2 caractères pour personnaliser" : "Sélectionnez 'Personnaliser' pour créer manuellement"}
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
                maxWidth="md"
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
                        
                        <TextField
                            label="Synopsis"
                            value={customSynopsis}
                            onChange={(e) => setCustomSynopsis(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Décrivez l'histoire du film..."
                        />
                        
                        {/* Sélection du réalisateur */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Réalisateur *
                            </Typography>
                            
                            {/* Autocomplete pour rechercher dans la base locale et TMDB */}
                            <Autocomplete
                                freeSolo
                                options={[...realisateurs, ...tmdbRealisateurs]}
                                loading={loadingRealisateurs}
                                value={selectedRealisateur}
                                inputValue={realisateurSearch}
                                onInputChange={(event, newInputValue) => {
                                    setRealisateurSearch(newInputValue);
                                }}
                                onChange={(event, newValue) => {
                                    if (newValue && newValue.isCustom) {
                                        // Créer un nouveau réalisateur
                                        setIsCreatingRealisateur(true);
                                        setSelectedRealisateur(newValue);
                                        const names = realisateurSearch.split(' ');
                                        setCustomRealisateurPrenom(names.slice(0, -1).join(' ') || '');
                                        setCustomRealisateurNom(names.slice(-1)[0] || '');
                                    } else if (newValue) {
                                        setSelectedRealisateur(newValue);
                                        setIsCreatingRealisateur(false);
                                        if (newValue.fromTMDB) {
                                            // Réalisateur de TMDB - créer automatiquement sans afficher le formulaire
                                            setCustomRealisateurNom(newValue.nom);
                                            setCustomRealisateurPrenom(newValue.prenom);
                                        }
                                    } else {
                                        setSelectedRealisateur(null);
                                        setIsCreatingRealisateur(false);
                                    }
                                }}
                                getOptionLabel={(option) => {
                                    if (typeof option === 'string') return option;
                                    if (option.fullName) return option.fullName;
                                    return `${option.prenom} ${option.nom}`;
                                }}
                                renderOption={(props, option) => {
                                    if (option.isCustom) {
                                        return (
                                            <Box component="li" {...props} sx={{ backgroundColor: '#fff3e0', fontWeight: 'bold' }}>
                                                <Typography variant="body1" color="primary">
                                                    {option.fullName}
                                                </Typography>
                                            </Box>
                                        );
                                    }
                                    
                                    return (
                                        <Box component="li" {...props}>
                                            <Box>
                                                <Typography variant="body1">
                                                    {option.fullName || `${option.prenom} ${option.nom}`}
                                                </Typography>
                                                {option.fromTMDB && (
                                                    <Typography variant="caption" color="primary">
                                                        TMDB
                                                    </Typography>
                                                )}
                                                {!option.fromTMDB && option.celebre && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        ★ Célèbre
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Ex: Christopher Nolan, James Cameron..."
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loadingRealisateurs ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                noOptionsText={realisateurSearch.length < 2 ? "Tapez au moins 2 caractères pour créer" : "Sélectionnez 'Créer' pour ajouter manuellement"}
                            />
                            
                            {/* Champs pour créer un nouveau réalisateur */}
                            {isCreatingRealisateur && (
                                <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                                        Informations du nouveau réalisateur
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField
                                                label="Prénom *"
                                                value={customRealisateurPrenom}
                                                onChange={(e) => setCustomRealisateurPrenom(e.target.value)}
                                                fullWidth
                                                required
                                                size="small"
                                            />
                                            
                                            <TextField
                                                label="Nom *"
                                                value={customRealisateurNom}
                                                onChange={(e) => setCustomRealisateurNom(e.target.value)}
                                                fullWidth
                                                required
                                                size="small"
                                            />
                                        </Box>
                                        
                                        <TextField
                                            label="Date de naissance"
                                            type="date"
                                            value={customRealisateurDateNaissance}
                                            onChange={(e) => setCustomRealisateurDateNaissance(e.target.value)}
                                            fullWidth
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                </Box>
                            )}
                            
                            {selectedRealisateur && !selectedRealisateur.isCustom && !selectedRealisateur.fromTMDB && (
                                <Box sx={{ mt: 1, p: 1.5, backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9' }}>
                                    <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                                        ✓ Réalisateur sélectionné : {selectedRealisateur.prenom} {selectedRealisateur.nom}
                                        {selectedRealisateur.celebre ? ' ★' : ''}
                                    </Typography>
                                </Box>
                            )}
                            
                            {selectedRealisateur && selectedRealisateur.fromTMDB && (
                                <Box sx={{ mt: 1, p: 1.5, backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9' }}>
                                    <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                                        ✓ Réalisateur TMDB sélectionné : {selectedRealisateur.fullName}
                                    </Typography>
                                </Box>
                            )}
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
