import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Avatar,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Grid,
    Rating
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const TMDB_API_KEY = 'f569ae6e648f04ab23e31f534f9b5f47';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function RealisateurCard({ realisateur, films, onFilmClick, isPopupMode = false, onClose }) {
    const [open, setOpen] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Si en mode popup, ouvrir automatiquement
    useEffect(() => {
        if (isPopupMode) {
            setOpen(true);
        }
    }, [isPopupMode]);

    // Calculer la note moyenne du réalisateur basée sur ses films
    const filmsOfDirector = films.filter(f => {
        const hasRealisateur = f.realisateur && f.realisateur.id === realisateur.id;
        const hasRating = f.rating != null && f.rating !== undefined;
        return hasRealisateur;
    });
    
    const filmsWithRating = filmsOfDirector.filter(f => f.rating != null && f.rating !== undefined);
    const averageRating = filmsWithRating.length > 0
        ? filmsWithRating.reduce((sum, f) => sum + f.rating, 0) / filmsWithRating.length
        : 0;

    console.log(`Realisateur ${realisateur.nom}: ${filmsOfDirector.length} films`, filmsOfDirector);

    useEffect(() => {
        fetchDirectorPhoto();
    }, [realisateur.nom, realisateur.prenom]);

    const fetchDirectorPhoto = async () => {
        setLoading(true);
        try {
            const searchQuery = `${realisateur.prenom} ${realisateur.nom}`;
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/person`,
                {
                    params: {
                        query: searchQuery,
                        include_adult: false,
                        language: 'fr-FR',
                        page: 1
                    },
                    headers: {
                        'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTY5YWU2ZTY0OGYwNGFiMjNlMzFmNTM0ZjliNWY0NyIsIm5iZiI6MTc2NTUzODAxNC43MzgsInN1YiI6IjY5M2JmOGRlNmRlZTkzMGZhOGNiMDA2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iRG_qZ3aUYTg9DVRr1mdqO0OVC8qbSaTeyPwwxFPsuk`,
                        'accept': 'application/json'
                    }
                }
            );

            if (response.data.results && response.data.results.length > 0) {
                const profile = response.data.results[0].profile_path;
                if (profile) {
                    setPhotoUrl(TMDB_IMAGE_BASE + profile);
                }
            }
        } catch (error) {
            console.error('Error fetching director photo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        if (isPopupMode && onClose) {
            onClose();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Non disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            {!isPopupMode && (
                <Card
                    sx={{
                        width: 180,
                        height: 220,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                        display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2,
                    backgroundColor: '#2c2c2c'
                }}
                onClick={handleOpen}
            >
                <Avatar
                    src={photoUrl}
                    sx={{
                        width: 100,
                        height: 100,
                        minWidth: 100,
                        minHeight: 100,
                        maxWidth: 100,
                        maxHeight: 100,
                        mb: 1.5,
                        fontSize: '2rem',
                        backgroundColor: '#1976d2',
                        flexShrink: 0,
                        '& img': {
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%'
                        }
                    }}
                >
                    {!photoUrl && `${realisateur.prenom[0]}${realisateur.nom[0]}`}
                </Avatar>
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fff', mb: 0.5 }}>
                        {realisateur.prenom} {realisateur.nom}
                    </Typography>
                    {averageRating > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Rating
                                value={averageRating}
                                precision={0.5}
                                readOnly
                                size="small"
                                sx={{
                                    '& .MuiRating-iconFilled': {
                                        color: '#ffd700',
                                    },
                                }}
                            />
                            <Typography variant="caption" sx={{ color: '#ccc' }}>
                                {averageRating.toFixed(1)}/5
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Card>
            )}

            {/* Dialog Détails */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#1e1e1e',
                        color: '#fff',
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {realisateur.prenom} {realisateur.nom}
                        {realisateur.celebre && (
                            <span style={{ color: '#ffd700', marginLeft: '8px' }}>★ Célèbre</span>
                        )}
                    </Typography>
                    <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        {/* Colonne gauche - Photo et infos */}
                        <Grid item xs={12} md={4}>
                            <Avatar
                                src={photoUrl}
                                sx={{
                                    width: 300,
                                    height: 300,
                                    minWidth: 300,
                                    minHeight: 300,
                                    maxWidth: 300,
                                    maxHeight: 300,
                                    fontSize: '4rem',
                                    backgroundColor: '#1976d2',
                                    flexShrink: 0,
                                    '& img': {
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%'
                                    }
                                }}
                            >
                                {!photoUrl && `${realisateur.prenom[0]}${realisateur.nom[0]}`}
                            </Avatar>
                            
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                    Date de naissance
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
                                    {formatDate(realisateur.dateNaissance)}
                                </Typography>

                                {averageRating > 0 && (
                                    <>
                                        <Typography variant="subtitle2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                            Note moyenne
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Rating
                                                value={averageRating}
                                                precision={0.5}
                                                readOnly
                                                sx={{
                                                    '& .MuiRating-iconFilled': {
                                                        color: '#ffd700',
                                                    },
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: '#ccc' }}>
                                                {averageRating.toFixed(1)}/5
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Grid>

                        {/* Colonne droite - Films */}
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 2 }}>
                                Films réalisés ({filmsOfDirector.length})
                            </Typography>
                            
                            {filmsOfDirector.length === 0 ? (
                                <Typography variant="body2" sx={{ color: '#ccc' }}>
                                    Aucun film dans la base de données
                                </Typography>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {filmsOfDirector.map(film => (
                                        <Box
                                            key={film.id}
                                            sx={{
                                                display: 'flex',
                                                gap: 2,
                                                padding: 1.5,
                                                backgroundColor: '#2c2c2c',
                                                borderRadius: 1,
                                                alignItems: 'center',
                                                cursor: onFilmClick ? 'pointer' : 'default',
                                                transition: 'background-color 0.2s',
                                                '&:hover': onFilmClick ? {
                                                    backgroundColor: '#3c3c3c'
                                                } : {}
                                            }}
                                            onClick={() => {
                                                if (onFilmClick) {
                                                    setOpen(false);
                                                    onFilmClick(film);
                                                }
                                            }}
                                        >
                                            <img
                                                src={film.posterUrl}
                                                alt={film.titre}
                                                style={{
                                                    width: 60,
                                                    height: 90,
                                                    objectFit: 'cover',
                                                    borderRadius: 4
                                                }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                    {film.titre}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#999' }}>
                                                    {film.dateSortie ? new Date(film.dateSortie).getFullYear() : 'N/A'} • {film.duree} min
                                                </Typography>
                                                {film.rating && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                        <Rating
                                                            value={film.rating}
                                                            precision={0.5}
                                                            readOnly
                                                            size="small"
                                                            sx={{
                                                                '& .MuiRating-iconFilled': {
                                                                    color: '#ffd700',
                                                                },
                                                            }}
                                                        />
                                                        <Typography variant="caption" sx={{ color: '#ccc' }}>
                                                            {film.rating.toFixed(1)}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
