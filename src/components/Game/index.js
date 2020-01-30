import React from 'react';
import GameDisplay from '../containers/GameDisplay';
import Console from '../molecules/Console';
import GameStateProvider from '../../helpers/reducers/gameStateReducer';
import HUD from '../containers/HUD';
import './Game.css';

const Game = () => {
    return (
        <GameStateProvider>
            <Console/>
            <div className="game">
                <HUD/>
                <GameDisplay/>
            </div>
        </GameStateProvider>
    );
}

export default Game;