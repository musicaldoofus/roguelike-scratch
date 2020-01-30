import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import PrintBtn from './PrintBtn';
import Beasterator from './Beasterator'
import Roller from './Roller';
import Locationator from './Locationator';
import './Console.css';

const Console = () => {
    const [gameState] = useGameState();
    
    const isActive = gameState.focusMode === 'console';
    return (
        <div className={`console${isActive ? ' active' : ''}`}>
            <PrintBtn/>
            <Beasterator/>
            <Roller/>
            <Locationator/>
        </div>
    );
}

export default Console;