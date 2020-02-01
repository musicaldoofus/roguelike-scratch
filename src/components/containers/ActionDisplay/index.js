import React from 'react';
import Room from '../../molecules/Room';
import './ActionDisplay.css';

const ActionDisplay = () => {
    const roomIndex = 0;

    console.log('render <ActionDisplay>');
    return (
        <div className="action-display">
            <Room roomIndex={roomIndex}/>
        </div>
    );
}

export default ActionDisplay;