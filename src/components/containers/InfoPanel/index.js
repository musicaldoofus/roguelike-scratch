import React from 'react';
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
            <div className="info-panel-inner panel">
                <CommandInfoPanel/>
            </div>
        </div>
    );
}

export default InfoPanel;