import React from 'react';
import { Box, Button } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';

export default function ViewSwitcher({ currentView, onViewChange }) {
    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
                startIcon={<MovieIcon />}
                onClick={() => onViewChange('films')}
                variant={currentView === 'films' ? 'contained' : 'outlined'}
                sx={{
                    color: currentView === 'films' ? '#000' : '#fff',
                    backgroundColor: currentView === 'films' ? '#90caf9' : 'transparent',
                    borderColor: '#90caf9',
                    '&:hover': {
                        backgroundColor: currentView === 'films' ? '#64b5f6' : 'rgba(144, 202, 249, 0.1)',
                    }
                }}
            >
                Films
            </Button>
            <Button
                startIcon={<PersonIcon />}
                onClick={() => onViewChange('realisateurs')}
                variant={currentView === 'realisateurs' ? 'contained' : 'outlined'}
                sx={{
                    color: currentView === 'realisateurs' ? '#000' : '#fff',
                    backgroundColor: currentView === 'realisateurs' ? '#90caf9' : 'transparent',
                    borderColor: '#90caf9',
                    '&:hover': {
                        backgroundColor: currentView === 'realisateurs' ? '#64b5f6' : 'rgba(144, 202, 249, 0.1)',
                    }
                }}
            >
                Réalisateurs
            </Button>
        </Box>
    );
}
