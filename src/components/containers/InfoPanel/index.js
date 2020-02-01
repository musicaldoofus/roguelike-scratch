import React from 'react';
import TargetHUD from '../TargetHUD';
import './InfoPanel.css';

const CommandInfoPanel = () => {
    return (
        <div className="command-instruction-panel">
            <div>
                c: toggle console
            </div>
            <div>
                i: inventory
            </div>
            <div>
                arrow keys: navigate
            </div>
        </div>
    );
}

const InfoPanel = () => {
    return (
        <div className="info-panel">
            <div className="info-panel-inner">
                <CommandInfoPanel/>
                <TargetHUD/>
            </div>
        </div>
    );
}

export default InfoPanel;