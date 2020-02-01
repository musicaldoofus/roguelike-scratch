import React from 'react';
import PlayerDisplay from '..//PlayerDisplay';
import Log from '../Log';
import './HUD.css';

const HUD = () => {
    return (
        <div className="heads-up-display">
            <PlayerDisplay/>
            <Log/>
        </div>
    );
}

export default HUD;