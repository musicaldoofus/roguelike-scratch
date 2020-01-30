import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './PlayerBattleControls.css';

const PlayerBattleControls = () => {
    const [gameState, dispatchGameState] = useGameState();

    const targetedBeast = gameState.location.nearbyBeasts.filter(b => b.isTargeted);
    console.log('t', targetedBeast);

    const handleTarget = () => dispatchGameState({
            type: 'openTargetBeast',
            ctx: 'battlepod'
        })
    const handleAttack = () => dispatchGameState({
            type: 'adjustHP',
            ctx: 'battlepod',
            targetActor: 'npc',
            amt: -1
        });

    return (
        <div className="player-controls">
            {targetedBeast.length === 0 ? (
                <button onClick={handleTarget}>Target</button>
            ) : (
                <button onClick={handleAttack}>Attack</button>
            )}
        </div>
    );
}

export default PlayerBattleControls;