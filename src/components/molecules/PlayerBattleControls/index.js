import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './PlayerBattleControls.css';

const PlayerBattleControls = () => {
    const [gameState, dispatchGameState] = useGameState();

    const targetedBeast = gameState.location.nearbyBeasts.filter(b => b.isTargeted);
    console.log('t', targetedBeast);

    const handleAttack = (e) => dispatchGameState(targetedBeast.length === 0 ?
        {
            type: 'openTargetBeast',
            ctx: 'battlepod'
        } : {
            type: 'adjustHP',
            ctx: 'battlepod',
            targetActor: 'npc',
            amt: -1
        });

    return (
        <div className="player-controls">
            <button onClick={handleAttack}>Attack</button>
        </div>
    );
}

export default PlayerBattleControls;