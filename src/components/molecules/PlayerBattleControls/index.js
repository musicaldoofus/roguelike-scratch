import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './PlayerBattleControls.css';

const PlayerBattleControls = () => {
    const [gameState, dispatchGameState] = useGameState();

    const targetedBeast = gameState.location.nearbyBeasts.filter(b => b.isTargeted);

    const handleTarget = () => dispatchGameState({ //confirm if this is still necessary
        type: 'openTargetBeast',
        ctx: 'playerControls'
    });

    const handleAttack = (attack) => dispatchGameState({
        type: 'adjustHP',
        ctx: 'playerControls',
        targetActor: 'npc',
        attack
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