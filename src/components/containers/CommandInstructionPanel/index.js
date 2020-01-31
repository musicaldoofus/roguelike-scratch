import React from 'react';
import './CommandInstructionPanel.css';

const CommandInstructionPanel = () => {
    return (
        <div className="command-instruction-panel">
            <div className="command-instruction-panel-nner">
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
        </div>
    );
}

export default CommandInstructionPanel;