import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './ActionHUD.css';

const ActionHUD = () => {
    const [gameState] = useGameState();

    const roomStats = gameState.location.nearbyBeasts.length;
    return (
        <div className="action-heads-up-display">
            Beasts in room: {roomStats}
        </div>
    );
}

export default ActionHUD;