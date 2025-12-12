import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function FilmCard(props) {
    const { film, onDelete, onEdit } = props;

    const handleClickOnDeleteButton = () => {
        // Appelle la fonction passée en props par le parent
        onDelete(film.id); 
    };

    const handleClickOnEditButton = () => {
        onEdit(film);
    };

    return (
        <Card variant="outlined" sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {film.titre}
                </Typography>
                <Typography variant="body1">
                    Durée : {film.duree} minutes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {/* Affiche le réalisateur si l'objet existe */}
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