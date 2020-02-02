import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './MapDisplay.css';

const MapDisplay = () => {
    const [gameState] = useGameState();

    const mapCells = gameState.location.rooms.map(({dimensionality}, i) => {
        const isPlayerInRoom = gameState.player.roomCoords.roomIndex === i;
        const style = {
            width: `${dimensionality}em`,
            height: `${dimensionality}em`,
            backgroundColor: isPlayerInRoom ? 'var(--red-dk-one)' : 'var(--red-dk-bg)'
        };
        return (
            <span className="map-room-tile" style={style}></span>
        );
    })

    return (
        <div className="map-display panel">
            <div className="map-display-inner-container">
                {mapCells}
            </div>
        </div>
    );
}

export default MapDisplay;