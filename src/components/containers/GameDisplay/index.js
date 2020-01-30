import React from 'react';
import ActionHUD from '../ActionHUD';
import ActionDisplay from '../ActionDisplay';
import './GameDisplay.css';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';

const GameDisplay = () => {
    const [gameState] = useGameState();

    const targetedBeasts = gameState.location.nearbyBeasts.filter(b => b.isTargeted);
    const withPanel = targetedBeasts.length > 0 || gameState.focusMode === 'inventory';
    return (
        <div className={`game-display${withPanel ? ' with-control-panel' : ''}`}>
            <ActionDisplay/>
            <ActionHUD/>
        </div>
    )
}

export default GameDisplay;