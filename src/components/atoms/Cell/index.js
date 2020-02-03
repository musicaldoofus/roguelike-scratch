import React from 'react';

const Cell = ({tileType, onClick, toRoomIndex}) => {
    return (
        <div className={`map-tile ${tileType}`} onClick={onClick}>
        </div>
    );
};

export default Cell;