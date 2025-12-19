import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia'; // Nouvel import pour l'image
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Note: Dans un vrai projet, mettez cette clé dans un fichier .env
const TMDB_API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTY5YWU2ZTY0OGYwNGFiMjNlMzFmNTM0ZjliNWY0NyIsIm5iZiI6MTc2NTUzODAxNC43MzgsInN1YiI6IjY5M2JmOGRlNmRlZTkzMGZhOGNiMDA2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iRG_qZ3aUYTg9DVRr1mdqO0OVC8qbSaTeyPwwxFPsuk";

export default function FilmCard(props) {
    const { film, onDelete, onEdit } = props;
    const [posterUrl, setPosterUrl] = useState(null);

    // Effet pour récupérer l'image via l'API
    useEffect(() => {
        const fetchPoster = async () => {
            // Sécurité 1 : Si pas de titre, on ne fait rien
            if (!film.titre) return;

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

                // Sécurité 2 : Gestion des erreurs HTTP (404, 500, 401...)
                // Si l'URL est mal formée ou le token invalide, response.ok sera false
                if (!response.ok) {
                    console.warn(`Erreur HTTP: ${response.status}`);
                    setPosterUrl(null); // On s'assure qu'aucune image n'est affichée
                    return; // On arrête l'exécution ici
                }

                const data = await response.json();

                // Sécurité 3 : Vérification de la structure de la donnée
                // On vérifie que 'results' existe, qu'il n'est pas vide, et que le premier élément a bien un chemin d'image
                if (data.results && data.results.length > 0 && data.results[0].poster_path) {
                    setPosterUrl(`https://image.tmdb.org/t/p/w300${data.results[0].poster_path}`);
                } else {
                    // Si le film est introuvable ou n'a pas d'image
                    setPosterUrl(null);
                }

            } catch (error) {
                // Sécurité 4 : Gestion des erreurs Réseau (Pas d'internet, DNS échec, etc.)
                console.error("Erreur lors du fetch ou parsing JSON:", error);
                setPosterUrl(null); // En cas de crash réseau, on n'affiche pas d'image
            }
        };

        fetchPoster();
    }, [film.titre]); // On relance si le titre change

    const handleClickOnDeleteButton = () => {
        onDelete(film.id);
    };

    const handleClickOnEditButton = () => {
        onEdit(film);
    };

    return (
        <Card variant="outlined" sx={{ marginBottom: 2, display: 'flex', flexDirection: 'column' }}>
            {/* Affichage conditionnel de l'image seulement si on a trouvé une URL */}
            {posterUrl && (
                <CardMedia
                    component="img"
                    height="300" // Hauteur fixe pour l'image, ajustable selon vos besoins
                    image={posterUrl}
                    alt={`Affiche du film ${film.titre}`}
                    sx={{ objectFit: 'contain', backgroundColor: '#f0f0f0' }} // contain pour voir l'affiche entière
                />
            )}

            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {film.titre}
                </Typography>
                <Typography variant="body1">
                    Durée : {film.duree} minutes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Réalisateur: {film.realisateur ? `${film.realisateur.prenom} ${film.realisateur.nom}` : 'Inconnu'}
                </Typography>

                <div style={{ marginTop: '10px' }}>
                    <IconButton onClick={handleClickOnDeleteButton} color="error">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={handleClickOnEditButton} color="primary">
                        <EditIcon />
                    </IconButton>
                </div>
            </CardContent>
        </Card>
    );
}