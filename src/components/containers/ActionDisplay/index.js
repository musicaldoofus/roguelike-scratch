import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import Room from '../../Game/Room';
import './ActionDisplay.css';

const ActionDisplay = () => {
    const [gameState] = useGameState();

    const roomData = gameState.location.rooms ? gameState.location.rooms.filter(r => r.id === gameState.player.levelCoords.roomId)[0] : null;
    return (
        <div className="action-display">
            {roomData && <Room {...roomData}/>}
        </div>
    );
}

export default ActionDisplay;