import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Header basique avec un logo ('./logo.jpeg')
import logo from './logo.png';

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Box
                    component="img"
                    sx={{
                        height: 50,
                        mr: 2,
                    }}
                    alt="Logo My Films"
                    src={logo}
                />

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My Films
                </Typography>
            </Toolbar>
        </AppBar>
    );
}