import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './Header';
import FilmContainer from './FilmContainer';
import RealisateurContainer from './RealisateurContainer';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState('films');
  const [popupStack, setPopupStack] = useState([]);

  const handleRealisateurClick = (realisateur) => {
    setPopupStack(prev => [...prev, { type: 'realisateur', id: realisateur.id }]);
  };

  const handleFilmClick = (film) => {
    setPopupStack(prev => [...prev, { type: 'film', id: film.id }]);
  };

  const handleClosePopup = () => {
    setPopupStack([]);  // Vider toute la pile au lieu de retirer le dernier élément
  };

  const currentPopup = popupStack.length > 0 ? popupStack[popupStack.length - 1] : null;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
         <Header />
         {currentView === 'films' ? (
           <FilmContainer 
             currentView={currentView} 
             onViewChange={setCurrentView}
             onRealisateurClick={handleRealisateurClick}
             onFilmClick={handleFilmClick}
             currentPopup={currentPopup}
             onClosePopup={handleClosePopup}
           />
         ) : (
           <RealisateurContainer 
             currentView={currentView} 
             onViewChange={setCurrentView}
             onFilmClick={handleFilmClick}
             onRealisateurClick={handleRealisateurClick}
             currentPopup={currentPopup}
             onClosePopup={handleClosePopup}
           />
         )}
      </div>
    </ThemeProvider>
  );
}

export default App;