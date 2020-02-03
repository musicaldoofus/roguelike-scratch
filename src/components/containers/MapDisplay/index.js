import React, { useMemo } from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './MapDisplay.css';

const MapDisplay = () => {
    //console.log('Invoke <MapDisplay>');
    const [gameState] = useGameState();

    const mapCells = useMemo(() => gameState.location.rooms.map(({dimensionality}, i) => {
        const isPlayerInRoom = gameState.player.roomCoords.roomIndex === i;
        const style = {
            width: `${dimensionality}em`,
            height: `${dimensionality}em`,
            backgroundColor: isPlayerInRoom ? 'var(--red-dk-one)' : 'var(--red-dk-two)'
        };
        return (
            <span key={i} className="map-room-tile" style={style}></span>
        );
    }), [
        gameState.player.roomCoords.roomIndex,
        gameState.location.rooms
    ]);

    return (
        <div className="map-display panel">
            <div className="map-display-inner-container">
                {mapCells}
            </div>
        </div>
    );
}

export default MapDisplay;