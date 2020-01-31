import React from 'react';
import GameStateProvider from '../../../helpers/reducers/gameStateReducer';
import Console from '../Console';
import HUD from '../HUD';
import ControlsPanel from '../ControlsPanel';
import GameDisplay from '../GameDisplay';
import CommandInstructionPanel from '../CommandInstructionPanel';
import './Game.css';

const Game = () => {
    return (
        <GameStateProvider>
            <Console/>
            <div className="game">
                <HUD/>
                <ControlsPanel/>
                <GameDisplay/>
                <CommandInstructionPanel/>
            </div>
        </GameStateProvider>
    );
}

export default Game;