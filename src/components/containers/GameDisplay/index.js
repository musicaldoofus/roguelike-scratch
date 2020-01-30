import React from 'react';
import ActionHUD from '../ActionHUD';
import ActionDisplay from '../ActionDisplay';
import './GameDisplay.css';

const GameDisplay = () => {
    return (
        <div className="game-display">
            <ActionDisplay/>
            <ActionHUD/>
        </div>
    )
}

export default GameDisplay;