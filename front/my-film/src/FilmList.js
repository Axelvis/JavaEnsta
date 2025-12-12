import React from 'react';
import FilmCard from './FilmCard';

export default function FilmList(props) {
    const { films, onDelete, onEdit } = props;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Liste des films</h2>
            {films.map((film) => (
                <FilmCard 
                    key={film.id} 
                    film={film} 
                    onDelete={onDelete} 
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}