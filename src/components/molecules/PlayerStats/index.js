import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './PlayerStats.css';

const PlayerStats = () => {
    const [gameState] = useGameState();

    const playerStats = gameState.player.vitalStats;
    return (
        <div className="player-display-stats">
            <div className="player-display-inner">
                {Object.keys(playerStats).map(s => <div key={s}>{s}: {playerStats[s]}</div>)}
            </div>
        </div>
    );
}

export default PlayerStats;