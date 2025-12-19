import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia'; // Nouvel import pour l'image
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { Dialog, DialogContent, DialogTitle, Box, Divider, Rating } from '@mui/material';
import { putFilm } from './api/FilmApi';

// Note: Dans un vrai projet, mettez cette clé dans un fichier .env
const TMDB_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTY5YWU2ZTY0OGYwNGFiMjNlMzFmNTM0ZjliNWY0NyIsIm5iZiI6MTc2NTUzODAxNC43MzgsInN1YiI6IjY5M2JmOGRlNmRlZTkzMGZhOGNiMDA2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iRG_qZ3aUYTg9DVRr1mdqO0OVC8qbSaTeyPwwxFPsuk";

export default function FilmCard(props) {
    const { film, onDelete, onEdit, onRatingChange, onRealisateurClick, onFilmClick, isPopupMode = false, onClose } = props;
    const [trailerKey, setTrailerKey] = useState(null);
    const [movieId, setMovieId] = useState(null);
    const [openTrailer, setOpenTrailer] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [hoverRating, setHoverRating] = useState(-1);
    const [reviews, setReviews] = useState([]);

    // Si en mode popup, ouvrir automatiquement les détails
    useEffect(() => {
        if (isPopupMode) {
            setOpenDetails(true);
        }
    }, [isPopupMode, film.id]); // Ajouter film.id pour re-déclencher quand le film change

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

                    // Récupérer les critiques (reviews)
                    const reviewsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/reviews?language=en-US&page=1`;
                    const reviewsResponse = await fetch(reviewsUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${TMDB_API_TOKEN}`,
                            'accept': 'application/json'
                        }
                    });

                    if (reviewsResponse.ok) {
                        const reviewsData = await reviewsResponse.json();
                        // Limiter à 3 critiques pour ne pas surcharger l'UI
                        setReviews(reviewsData.results?.slice(0, 3) || []);
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

    const handleRatingChange = async (event, newValue) => {
        if (event) event.stopPropagation();
        try {
            const updatedFilm = { ...film, rating: newValue };
            await putFilm(updatedFilm);
            console.log(`Note ${newValue} enregistrée pour ${film.titre}`);
            if (onRatingChange) {
                onRatingChange();
            }
        } catch (err) {
            console.error("Erreur mise à jour note:", err);
            alert("Erreur lors de l'enregistrement de la note");
        }
    };

    const handleRatingHover = (event, newHover) => {
        setHoverRating(newHover);
    };

    const handleRatingHoverEnd = () => {
        setHoverRating(-1);
    };

    return (
        <>
        {!isPopupMode && (
        <Card 
            onClick={() => setOpenDetails(true)}
            variant="outlined" 
            sx={{ 
                width: '200px',
                height: '400px',
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

            {/* Titre et étoiles */}
            <CardContent sx={{ padding: '8px', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Étoiles au-dessus du titre */}
                <Box 
                    onClick={(e) => e.stopPropagation()}
                    onMouseLeave={handleRatingHoverEnd}
                    sx={{ marginBottom: '4px' }}
                >
                    <Rating
                        value={film.rating || 0}
                        precision={0.5}
                        onChange={handleRatingChange}
                        onChangeActive={handleRatingHover}
                        icon={<StarIcon sx={{ fontSize: '1.2rem', color: '#ffd700' }} />}
                        emptyIcon={<StarBorderIcon sx={{ fontSize: '1.2rem', color: hoverRating !== -1 ? 'rgba(255, 215, 0, 0.5)' : '#888' }} />}
                        sx={{
                            '& .MuiRating-iconEmpty': {
                                color: hoverRating !== -1 ? 'rgba(255, 215, 0, 0.5)' : '#888'
                            }
                        }}
                    />
                </Box>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        textAlign: 'center', 
                        fontWeight: 'bold', 
                        fontSize: '0.9rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.2em',
                        maxHeight: '2.4em'
                    }}
                >
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
        )}

        {/* Dialog pour la bande-annonce */}
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

        {/* Modal pour les détails du film */}
        <Dialog 
            open={openDetails} 
            onClose={() => {
                setOpenDetails(false);
                if (isPopupMode && onClose) {
                    onClose();
                }
            }}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#1e1e1e',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }
            }}
        >
            <DialogTitle sx={{ 
                backgroundColor: '#2c2c2c', 
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                borderBottom: '2px solid #444'
            }}>
                {film.titre}
            </DialogTitle>
            <DialogContent sx={{ padding: '24px', backgroundColor: '#1e1e1e' }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Affiche à gauche */}
                    <Box sx={{ flex: '0 0 300px', mt: 2 }}>
                        {film.posterUrl ? (
                            <img 
                                src={film.posterUrl} 
                                alt={`Affiche du film ${film.titre}`}
                                style={{ 
                                    width: '100%', 
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
                                }}
                            />
                        ) : (
                            <Box sx={{ 
                                width: '100%', 
                                height: '450px', 
                                backgroundColor: '#2c2c2c', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                borderRadius: '8px',
                                color: '#888'
                            }}>
                                Pas d'affiche
                            </Box>
                        )}
                        
                        {/* Note avec étoiles sous l'affiche */}
                        <Box 
                            sx={{ 
                                mt: 2, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                backgroundColor: '#2c2c2c',
                                borderRadius: '8px',
                                padding: '12px'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Typography variant="subtitle2" sx={{ color: '#888', fontSize: '0.85rem', mb: 1 }}>
                                Votre note
                            </Typography>
                            <Rating
                                value={film.rating || 0}
                                precision={0.5}
                                onChange={handleRatingChange}
                                onChangeActive={handleRatingHover}
                                onMouseLeave={handleRatingHoverEnd}
                                icon={<StarIcon sx={{ fontSize: '1.5rem', color: '#ffd700' }} />}
                                emptyIcon={<StarBorderIcon sx={{ fontSize: '1.5rem', color: hoverRating !== -1 ? 'rgba(255, 215, 0, 0.5)' : '#888' }} />}
                                sx={{
                                    '& .MuiRating-iconEmpty': {
                                        color: hoverRating !== -1 ? 'rgba(255, 215, 0, 0.5)' : '#888'
                                    }
                                }}
                            />
                            {film.rating && (
                                <Typography variant="caption" sx={{ color: '#ffd700', mt: 1 }}>
                                    {film.rating}/5
                                </Typography>
                            )}
                        </Box>

                        {/* Synopsis sous la note */}
                        {film.synopsis && (
                            <Box sx={{ mt: 2, backgroundColor: '#2c2c2c', borderRadius: '8px', padding: '12px' }}>
                                <Typography variant="subtitle2" sx={{ color: '#4caf50', fontWeight: 'bold', fontSize: '0.9rem', mb: 1 }}>
                                    Synopsis
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.5' }}>
                                    {film.synopsis}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Détails à droite */}
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 2 }}>
                            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                Informations
                            </Typography>
                            {/* Boutons d'action alignés à droite */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {trailerKey && (
                                    <IconButton 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDetails(false);
                                            setOpenTrailer(true);
                                        }}
                                        sx={{ 
                                            backgroundColor: '#4caf50',
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#45a049'
                                            },
                                            padding: '8px'
                                        }}
                                        size="small"
                                    >
                                        <PlayArrowIcon fontSize="small" />
                                    </IconButton>
                                )}
                                <IconButton 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDetails(false);
                                        handleClickOnEditButton();
                                    }} 
                                    sx={{ 
                                        backgroundColor: '#2196f3',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#1976d2'
                                        },
                                        padding: '8px'
                                    }}
                                    size="small"
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDetails(false);
                                        handleClickOnDeleteButton();
                                    }} 
                                    sx={{ 
                                        backgroundColor: '#f44336',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#d32f2f'
                                        },
                                        padding: '8px'
                                    }}
                                    size="small"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 2, backgroundColor: '#444' }} />
                        
                        {film.dateSortie && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#888', fontSize: '0.85rem' }}>
                                    Date de sortie
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                    {new Date(film.dateSortie).toLocaleDateString('fr-FR', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </Typography>
                            </Box>
                        )}

                        {film.duree && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#888', fontSize: '0.85rem' }}>
                                    Durée
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                    {film.duree} minutes
                                </Typography>
                            </Box>
                        )}

                        {film.realisateur && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#888', fontSize: '0.85rem' }}>
                                    Réalisateur
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography 
                                        variant="body1" 
                                        component="span"
                                        sx={{ 
                                            fontSize: '1rem',
                                            cursor: onRealisateurClick ? 'pointer' : 'default',
                                            '&:hover': onRealisateurClick ? {
                                                color: '#4caf50',
                                                textDecoration: 'underline'
                                            } : {}
                                        }}
                                        onClick={() => {
                                            if (onRealisateurClick && film.realisateur) {
                                                setOpenDetails(false);
                                                onRealisateurClick(film.realisateur);
                                            }
                                        }}
                                    >
                                        {film.realisateur.prenom} {film.realisateur.nom}
                                    </Typography>
                                    {film.realisateur.celebre && (
                                        <span style={{ color: '#ffd700', fontSize: '1rem' }}>★ Célèbre</span>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {film.dateAjout && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#888', fontSize: '0.85rem' }}>
                                    Ajouté le
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                    {new Date(film.dateAjout).toLocaleDateString('fr-FR', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                            </Box>
                        )}

                        {film.watchProviders && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#888', fontSize: '0.85rem' }}>
                                    Disponible sur
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem', color: '#4caf50' }}>
                                    {film.watchProviders}
                                </Typography>
                            </Box>
                        )}

                        {/* Critiques */}
                        {reviews.length > 0 && (
                            <Box sx={{ mb: 2, mt: 3 }}>
                                <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 2 }}>
                                    Critiques
                                </Typography>
                                <Divider sx={{ mb: 2, backgroundColor: '#444' }} />
                                {reviews.map((review) => (
                                    <Box key={review.id} sx={{ mb: 3, p: 2, backgroundColor: '#2c2c2c', borderRadius: '8px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            {review.author_details?.avatar_path && (
                                                <img 
                                                    src={review.author_details.avatar_path.startsWith('/http') 
                                                        ? review.author_details.avatar_path.substring(1)
                                                        : `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
                                                    } 
                                                    alt={review.author}
                                                    style={{ 
                                                        width: '40px', 
                                                        height: '40px', 
                                                        borderRadius: '50%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            )}
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                    {review.author}
                                                </Typography>
                                                {review.author_details?.rating && (
                                                    <Typography variant="caption" sx={{ color: '#ffd700' }}>
                                                        ★ {review.author_details.rating}/10
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#ccc', 
                                                fontSize: '0.9rem',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 4,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {review.content}
                                        </Typography>
                                        {review.content.length > 300 && (
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: '#4caf50', 
                                                    cursor: 'pointer',
                                                    '&:hover': { textDecoration: 'underline' },
                                                    mt: 1,
                                                    display: 'block'
                                                }}
                                                onClick={() => window.open(review.url, '_blank')}
                                            >
                                                Lire la suite...
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
        </>
    );
}