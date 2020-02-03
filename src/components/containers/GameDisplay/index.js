import React from 'react';
import ActionHUD from '../ActionHUD';
import ActionDisplay from '../ActionDisplay';
import MapDisplay from '../MapDisplay';
import './GameDisplay.css';

const GameDisplay = () => {
    //console.log('invoke <GameDisplay>')
    return (
        <div className="game-display">
            <ActionDisplay/>
            <ActionHUD/>
            <MapDisplay/>
        </div>
    );
}

export default GameDisplay;