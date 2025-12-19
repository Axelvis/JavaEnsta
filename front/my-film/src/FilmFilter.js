import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import ViewSwitcher from './ViewSwitcher';

export default function FilmFilter(props) {
    const { searchTerm, onSearchChange, sortOption, onSortChange, currentView, onViewChange } = props;

    return (
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
                    label="Rechercher un film"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    sx={{ minWidth: '300px', flex: 1 }}
                    placeholder="Titre, réalisateur..."
                />
                
                <FormControl sx={{ minWidth: '250px' }}>
                    <InputLabel>Trier par</InputLabel>
                    <Select
                        value={sortOption}
                        label="Trier par"
                        onChange={(e) => onSortChange(e.target.value)}
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
                    <MenuItem value="titre-asc">Titre (A → Z)</MenuItem>
                    <MenuItem value="titre-desc">Titre (Z → A)</MenuItem>
                    <MenuItem value="realisateur-asc">Réalisateur (A → Z)</MenuItem>
                    <MenuItem value="realisateur-desc">Réalisateur (Z → A)</MenuItem>
                    <MenuItem value="duree-asc">Durée (Plus court)</MenuItem>
                    <MenuItem value="duree-desc">Durée (Plus long)</MenuItem>
                    <MenuItem value="dateAjout-desc">Date d'ajout (Plus récent)</MenuItem>
                    <MenuItem value="dateAjout-asc">Date d'ajout (Plus ancien)</MenuItem>
                    <MenuItem value="rating-desc">Note (Meilleure)</MenuItem>
                    <MenuItem value="rating-asc">Note (Moins bonne)</MenuItem>
                </Select>
            </FormControl>
            </Box>
        </Box>
    );
}
