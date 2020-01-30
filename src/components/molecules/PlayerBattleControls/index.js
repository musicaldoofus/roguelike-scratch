import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './PlayerBattleControls.css';

const PlayerBattleControls = () => {
    const [, dispatchGameState] = useGameState();

    const targetBeast = () => dispatchGameState({
        type: 'openTargetBeast',
        ctx: 'battlepod'
    });

    return (
        <div className="player-controls">
            <button onClick={targetBeast}>Attack</button>
        </div>
    );
}

export default PlayerBattleControls;