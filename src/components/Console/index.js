import React, { useState } from 'react';
import Beasterator from './Beasterator';
import RollerWithDisplay from './Roller';
import BattlePod from './BattlePod';
import Display, { MsgAdder } from '../molecules/Display';
import GameStateProvider, { useGameState } from '../../helpers/reducers/gameStateReducer';
import './Console.css';

const PrintBtn = () => {
    const [state] = useGameState();
    const printGameState = () => console.log('p', state);

    return (
        <div>
            <button onClick={printGameState}>Print GameState</button>
        </div>
    );
}

const Console = () => {
    const [isCollapsed, setCollapsed] = useState(false);
    
    const handleToggleCollapse = () => setCollapsed(!isCollapsed);

    return (
        <GameStateProvider>
            <div className="console">
                {!isCollapsed &&
                    <div className="console-body">
                        <PrintBtn/>
                        <Beasterator/>
                        <RollerWithDisplay/>
                        <MsgAdder/>
                        <Display/>
                        <BattlePod/>
                    </div>
                }
                <div className="console-collapse-btn">
                    <button onClick={handleToggleCollapse}>{isCollapsed ? 'Expand \u2193' : 'Collapse \u2191'}</button>
                </div>
            </div>
        </GameStateProvider>
    );
}

export default Console;