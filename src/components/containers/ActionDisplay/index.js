import React from 'react';
import Room from '../Room';
import './ActionDisplay.css';

const ActionDisplay = () => {
    const roomIndex = 0;
    return (
        <div className="action-display">
            <Room roomIndex={roomIndex}/>
        </div>
    );
}

export default ActionDisplay;