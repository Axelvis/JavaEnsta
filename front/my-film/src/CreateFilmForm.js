import React, { useState, useEffect } from 'react';
import { 
    TextField, Button, Select, MenuItem, FormControl, InputLabel, 
    Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { getAllRealisateurs, postRealisateur } from './api/RealisateurApi';

export default function CreateFilmForm(props) {
    const initialData = props.film || props.initialValues || {};
    const [titre, setTitre] = useState(initialData.titre || '');
    const [duree, setDuree] = useState(initialData.duree || '');
    const [realisateurId, setRealisateurId] = useState(initialData.realisateur?.id || '');
    
    const [realisateurs, setRealisateurs] = useState([]);
    
    // États pour la modale d'ajout de réalisateur
    const [openNewReal, setOpenNewReal] = useState(false);
    const [newRealNom, setNewRealNom] = useState('');
    const [newRealPrenom, setNewRealPrenom] = useState('');
    const [newRealDateNaissance, setNewRealDateNaissance] = useState('');

    // Charger les réalisateurs
    const fetchRealisateurs = () => {
        getAllRealisateurs().then(res => setRealisateurs(res.data));
    };

    useEffect(() => {
        fetchRealisateurs();
    }, []);

    // Mettre à jour les champs quand le film à éditer change
    useEffect(() => {
        if (props.film) {
            setTitre(props.film.titre || '');
            setDuree(props.film.duree || '');
            setRealisateurId(props.film.realisateur?.id || '');
        }
    }, [props.film]);

    // Gestion du changement dans le Select
    const handleRealisateurChange = (e) => {
        const value = e.target.value;
        if (value === "ADD_NEW") {
            // Si l'utilisateur choisit "+ Ajouter...", on ouvre la modale et on ne change pas la valeur actuelle
            setOpenNewReal(true);
        } else {
            setRealisateurId(value);
        }
    };

    const handleSubmit = () => {
        const filmData = {
            titre: titre,
            duree: parseInt(duree),
            realisateurId: realisateurId
        };
        
        // Ajouter l'ID si on est en mode édition
        if (props.film && props.film.id) {
            filmData.id = props.film.id;
        }
        
        props.onSubmit(filmData);
        
        // Reset des champs seulement si on n'est pas en mode édition
        if (!props.film && !props.initialValues) {
            setTitre(''); 
            setDuree(''); 
            setRealisateurId('');
        }
    };

    // Sauvegarder le nouveau réalisateur
    const handleSaveNewRealisateur = () => {
        if (!newRealNom || !newRealPrenom || !newRealDateNaissance) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const realisateurData = {
            nom: newRealNom,
            prenom: newRealPrenom,
            dateNaissance: newRealDateNaissance
        };

        postRealisateur(realisateurData)
            .then(response => {
                const newReal = response.data;
                // Mettre à jour la liste locale et sélectionner le nouveau
                setRealisateurs([...realisateurs, newReal]);
                setRealisateurId(newReal.id);
                
                // Fermer et reset
                setOpenNewReal(false);
                setNewRealNom('');
                setNewRealPrenom('');
                setNewRealDateNaissance('');
            })
            .catch(err => {
                console.error('Erreur création réalisateur', err);
                alert('Erreur lors de la création du réalisateur');
            });
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
            <TextField label="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} />
            <TextField label="Durée" type="number" value={duree} onChange={(e) => setDuree(e.target.value)} />
            
            <FormControl fullWidth>
                <InputLabel id="select-real-label">Réalisateur</InputLabel>
                <Select 
                    labelId="select-real-label"
                    value={realisateurId} 
                    label="Réalisateur" 
                    onChange={handleRealisateurChange} // On utilise notre fonction personnalisée
                >
                    {/* --- L'OPTION D'AJOUT EST ICI --- */}
                    <MenuItem value="ADD_NEW" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        <em>+ Ajouter un réalisateur</em>
                    </MenuItem>
                    
                    {/* La liste normale */}
                    {realisateurs.map((real) => (
                        <MenuItem key={real.id} value={real.id}>
                            {real.prenom} {real.nom}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button variant="contained" onClick={handleSubmit}>
                {(props.film || props.initialValues) ? "Modifier" : "Créer le film"}
            </Button>

            {/* --- MODALE D'AJOUT DE RÉALISATEUR --- */}
            <Dialog open={openNewReal} onClose={() => setOpenNewReal(false)}>
                <DialogTitle>Nouveau Réalisateur</DialogTitle>
                <DialogContent>
                    <TextField 
                        autoFocus
                        margin="dense"
                        label="Prénom"
                        fullWidth
                        value={newRealPrenom}
                        onChange={(e) => setNewRealPrenom(e.target.value)}
                    />
                    <TextField 
                        margin="dense"
                        label="Nom"
                        fullWidth
                        value={newRealNom}
                        onChange={(e) => setNewRealNom(e.target.value)}
                    />
                    <TextField 
                        margin="dense"
                        label="Date de naissance"
                        type="date"
                        fullWidth
                        value={newRealDateNaissance}
                        onChange={(e) => setNewRealDateNaissance(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewReal(false)}>Annuler</Button>
                    <Button onClick={handleSaveNewRealisateur}>Ajouter</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}