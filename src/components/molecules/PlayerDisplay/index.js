import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';

const PlayerBattleControls = () => {
    const [, dispatchGameState] = useGameState();

    const adjustHP = (amt = -1) => dispatchGameState({
        type: 'adjustHP',
        ctx: 'battlepod',
        targetActor: 'npc',
        amt
    });

    return (
        <div className="player-controls">
            <button onClick={() => adjustHP(-1)}>Attack</button>
        </div>
    );
}

const PlayerBattleAvatar = () => {
    const imgStyle = {maxWidth: '100%', height: '100%'};
    return (
        <div className="player-display-avatar" style={{display: 'block', height: '8em'}}>
            <img style={imgStyle} src="https://i.pinimg.com/originals/7e/85/17/7e8517acd27a3d13a18704708892afc9.png" alt="avatar"/>
        </div>
    );
}

const PlayerBattleStats = () => {
    const [gameState] = useGameState();

    const playerStats = gameState.player.vitalStats;
    return (
        <div className="player-display-stats">
            {Object.keys(playerStats).map(s => <div key={s}>{s}: {playerStats[s]}</div>)}
        </div>
    );
}

const PlayerDisplay = () => {
    const [gameState] = useGameState();

    const battleBeast = gameState.location.nearbyBeasts.filter(b => b.isInBattle)[0];
    return (
        <div className="player-display">
            <PlayerBattleAvatar/>
            <PlayerBattleStats/>
            {battleBeast && <PlayerBattleControls/>}
        </div>
    );
}

export default PlayerDisplay;