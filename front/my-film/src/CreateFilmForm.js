import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getAllRealisateurs } from './api/RealisateurApi';

export default function CreateFilmForm(props) {
    const [titre, setTitre] = useState('');
    const [duree, setDuree] = useState('');
    const [realisateurId, setRealisateurId] = useState('');
    const [realisateurs, setRealisateurs] = useState([]);

    // Charger les réalisateurs au démarrage du composant
    useEffect(() => {
        getAllRealisateurs()
            .then(res => setRealisateurs(res.data))
            .catch(err => console.error("Erreur chargement réalisateurs", err));
    }, []);

    // Mettre à jour le formulaire si un film est passé en props (mode édition)
    useEffect(() => {
        if (props.film) {
            setTitre(props.film.titre);
            setDuree(props.film.duree);
            setRealisateurId(props.film.realisateurId || '');
        } else {
            setTitre('');
            setDuree('');
            setRealisateurId('');
        }
    }, [props.film]);

    const handleSubmit = () => {
        // Création de l'objet film
        const newFilm = {
            titre: titre,
            duree: parseInt(duree),
            realisateurId: realisateurId
        };
        
        if (props.film && props.film.id) {
            newFilm.id = props.film.id;
        }

        // Appel de la fonction du parent pour envoyer au backend
        props.onSubmit(newFilm);
        
        // Reset des champs seulement si on n'est pas en mode édition (ou laisser le parent gérer la fermeture)
        if (!props.film) {
            setTitre('');
            setDuree('');
            setRealisateurId('');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px', borderRadius: '8px' }}>
            {!props.film && <h3>Ajouter un film</h3>}
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', maxWidth: '400px' }}>
                <TextField 
                    label="Titre" 
                    variant="outlined" 
                    value={titre} 
                    onChange={(e) => setTitre(e.target.value)} 
                />
                <TextField 
                    label="Durée (minutes)" 
                    type="number" 
                    variant="outlined" 
                    value={duree} 
                    onChange={(e) => setDuree(e.target.value)} 
                />
                
                <FormControl fullWidth>
                    <InputLabel id="realisateur-select-label">Réalisateur</InputLabel>
                    <Select
                        labelId="realisateur-select-label"
                        value={realisateurId}
                        label="Réalisateur"
                        onChange={(e) => setRealisateurId(e.target.value)}
                    >
                        {realisateurs.map((real) => (
                            <MenuItem key={real.id} value={real.id}>
                                {real.prenom} {real.nom}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={handleSubmit}>
                    Créer
                </Button>
            </div>
        </div>
    );
}