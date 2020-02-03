import React from 'react';
import PlayerCell from '../../atoms/PlayerCell';

const PlayerGrid = ({gridStyle, playerCoords}) => {
    const gridAreaStyle = {
        gridColumn: `${playerCoords.x + 1} / ${playerCoords.x + 1}`,
        gridRow: `${playerCoords.y + 1} / ${playerCoords.y + 1}`
    };
    
    return (
        <div className="room-grid player-grid" style={gridStyle}>
            <PlayerCell playerCoords={playerCoords} gridAreaStyle={gridAreaStyle}/>
        </div>
    );
}

export default PlayerGrid;