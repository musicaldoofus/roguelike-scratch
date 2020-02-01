import React, { useMemo } from 'react';
import Cell from '../../atoms/Cell';

const TileGrid = ({tiles, gridStyle, handleClickTile}) => {
    const roomCoords = useMemo(() => {
        const onClickTile = (index) => handleClickTile({
            ctx: 'cell',
            type: 'handleClickTile',
            index
        });

        return tiles.map(({tileType}, i) => {
            return (
                <Cell
                    key={i}
                    tileType={tileType}
                    onClick={() => onClickTile(i)}
                />
            );
        });
    }, [
        tiles,
        handleClickTile
    ]);

    return (
        <div className="room-grid tile-grid" style={gridStyle}>
            {roomCoords}
        </div>
    );
}

export default TileGrid;