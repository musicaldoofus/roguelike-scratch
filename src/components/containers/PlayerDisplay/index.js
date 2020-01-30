import React from 'react';
import PlayerAvatar from '../../atoms/PlayerAvatar';
import PlayerStats from '../../molecules/PlayerStats';
import './PlayerDisplay.css';

const PlayerDisplay = () => {
    return (
        <div className="player-display">
            <PlayerAvatar/>
            <PlayerStats/>
        </div>
    );
}

export default PlayerDisplay;