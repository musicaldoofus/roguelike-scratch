import React from 'react';

const Cell = ({tileType, onClick}) => {
    console.log('render <Cell>')
    return (
        <div className={`map-tile ${tileType}`} onClick={onClick}>
        </div>
    );
};

export default Cell;