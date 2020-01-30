import React from 'react';
import avatar from '../../../media/img/rl_avatar.svg';
import './PlayerAvatar.css';

const PlayerAvatar = () => {
    return (
        <div className="player-display-avatar">
            <img src={avatar} alt="player avatar"/>
        </div>
    );
}

export default PlayerAvatar;