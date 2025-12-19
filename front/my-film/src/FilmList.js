import React from 'react';
import FilmCard from './FilmCard';

export default function FilmList(props) {
    const { films, onDelete, onEdit } = props;

    return (
        <div style={{ 
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
            justifyItems: 'center'
        }}>
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