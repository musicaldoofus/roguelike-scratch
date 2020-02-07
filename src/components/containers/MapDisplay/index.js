import React, { useMemo } from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './MapDisplay.css';

const MapDisplay = () => {
    //console.log('Invoke <MapDisplay>');
    const [gameState] = useGameState();

    const mapCells = useMemo(() => gameState.location.rooms.map((room, i) => {
        const isPlayerInRoom = gameState.player.roomCoords.roomIndex === i;
        const style = {
            width: `${room.dimensionality}em`,
            height: `${room.dimensionality}em`,
            backgroundColor: isPlayerInRoom ? 'var(--red-dk-one)' : 'var(--red-dk-two)',
            top: `${room.coords.y}em`,
            left: `${room.coords.x}em`
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