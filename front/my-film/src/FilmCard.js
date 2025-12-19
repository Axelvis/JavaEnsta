import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia'; // Nouvel import pour l'image
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Dialog, DialogContent } from '@mui/material';

// Note: Dans un vrai projet, mettez cette clé dans un fichier .env
const TMDB_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTY5YWU2ZTY0OGYwNGFiMjNlMzFmNTM0ZjliNWY0NyIsIm5iZiI6MTc2NTUzODAxNC43MzgsInN1YiI6IjY5M2JmOGRlNmRlZTkzMGZhOGNiMDA2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iRG_qZ3aUYTg9DVRr1mdqO0OVC8qbSaTeyPwwxFPsuk";

export default function FilmCard(props) {
    const { film, onDelete, onEdit } = props;
    const [trailerKey, setTrailerKey] = useState(null);
    const [movieId, setMovieId] = useState(null);
    const [openTrailer, setOpenTrailer] = useState(false);

    // Effet pour récupérer l'ID du film et la bande-annonce
    useEffect(() => {
        const fetchTrailer = async () => {
            // Ne chercher la bande-annonce que si le film a une affiche (donc ajouté via TMDB)
            if (!film.posterUrl || !film.titre) return;

            try {
                const query = encodeURIComponent(film.titre);
                const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=fr-FR&page=1`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${TMDB_API_TOKEN}`,
                        'accept': 'application/json'
                    }
                });

                if (!response.ok) return;

                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    const movie = data.results[0];
                    setMovieId(movie.id);

                    // Récupérer la bande-annonce
                    const videoUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=fr-FR`;
                    const videoResponse = await fetch(videoUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${TMDB_API_TOKEN}`,
                            'accept': 'application/json'
                        }
                    });

                    if (!videoResponse.ok) return;

                    const videoData = await videoResponse.json();
                    
                    const trailer = videoData.results?.find(
                        video => video.type === 'Trailer' && video.site === 'YouTube'
                    );
                    
                    if (trailer) {
                        setTrailerKey(trailer.key);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la bande-annonce:", error);
            }
        };

        fetchTrailer();
    }, [film.titre, film.posterUrl]);

    const handleClickOnDeleteButton = () => {
        onDelete(film.id);
    };

    const handleClickOnEditButton = () => {
        onEdit(film);
    };

    return (
        <>
        <Card 
            variant="outlined" 
            sx={{ 
                width: '200px',
                height: '350px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                },
                position: 'relative'
            }}
        >
            {/* Affichage de l'affiche */}
            {film.posterUrl ? (
                <CardMedia
                    component="img"
                    sx={{ 
                        height: '300px',
                        width: '100%',
                        objectFit: 'cover'
                    }}
                    image={film.posterUrl}
                    alt={`Affiche du film ${film.titre}`}
                />
            ) : (
                <div style={{ 
                    height: '300px', 
                    backgroundColor: '#2c2c2c', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#888'
                }}>
                    Pas d'affiche
                </div>
            )}

            {/* Titre en dessous */}
            <CardContent sx={{ padding: '8px', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {film.titre}
                </Typography>
            </CardContent>

            {/* Boutons d'action en overlay au survol */}
            <div style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                display: 'flex',
                gap: '5px',
                backgroundColor: 'rgba(30, 30, 30, 0.85)',
                borderRadius: '4px',
                padding: '2px'
            }}>
                {trailerKey && (
                    <IconButton 
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenTrailer(true);
                        }}
                        disableRipple
                        sx={{ 
                            padding: '6px',
                            backgroundColor: 'transparent',
                            color: '#4caf50',
                            borderRadius: '50%',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s'
                        }}
                        size="small"
                    >
                        <PlayArrowIcon fontSize="medium" />
                    </IconButton>
                )}
                <IconButton 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClickOnEditButton();
                    }} 
                    color="primary" 
                    size="small"
                    sx={{ padding: '4px' }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClickOnDeleteButton();
                    }} 
                    color="error" 
                    size="small"
                    sx={{ padding: '4px' }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </div>
        </Card>

        {/* Modal pour la bande-annonce */}
        <Dialog 
            open={openTrailer} 
            onClose={() => setOpenTrailer(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#000',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }
            }}
        >
            <DialogContent sx={{ padding: 0, backgroundColor: '#000' }}>
                {trailerKey && (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                            }}
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                            title={`Bande-annonce de ${film.titre}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
        </>
    );
}