import React from 'react';

const Cell = ({tileType, onClick}) => {
    return (
        <div className={`map-tile ${tileType}`} onClick={onClick}>
        </div>
    );
};

export default Cell;