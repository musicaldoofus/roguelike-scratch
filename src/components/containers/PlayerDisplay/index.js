import React from 'react';
import PlayerAvatar from '../../atoms/PlayerAvatar';
import PlayerBattleControls from '../../molecules/PlayerBattleControls';
import PlayerStats from '../../molecules/PlayerStats';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './PlayerDisplay.css';

const PlayerDisplay = () => {
    const [gameState] = useGameState();

    return (
        <div className="player-display">
            <PlayerAvatar/>
            <PlayerStats/>
            {gameState.location.nearbyBeasts.length > 0 && <PlayerBattleControls/>}
        </div>
    );
}

export default PlayerDisplay;