import React from 'react';
import './Room.css';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import toCoords from '../../../helpers/toCoords';

const Room = ({tiles, dimensionality}) => {
    const [gameState, dispatchGameState] = useGameState();
    
    const handleClickTile = (tile, index) => dispatchGameState({
        ctx: 'room',
        type: 'handleClickTile',
        tile,
        index
    });

    const roomCoords = tiles.map((tile, i) => {
        const tileCoords = toCoords(i, dimensionality); //improve - need to access roomIndex
        const beast = gameState.location.nearbyBeasts.filter(b => b.coords.x === tileCoords.x && b.coords.y === tileCoords.y)[0];
        const beastStyle = beast ? {
            gridRow: `${beast.coords.y} / ${beast.coords.y + 1}`,
            gridColumn: `${beast.coords.x} / ${beast.coords.x + 1}`
        } : null;
        return (
            <div className={`map-tile ${tile.type}`} onClick={() => handleClickTile(tile, i)}>
                {beast && (
                    <div className={`beast ${beast.baseTitle.replace(/\s/g, '-').toLowerCase()}${beast.isTargeted ? ' is-targeted' : ''}`} style={beastStyle}></div>
                )}
            </div>
        );
    });

    const gridUnit = '1fr';

    const gridStyle = {
        gridTemplateColumns: `repeat(${dimensionality}, ${gridUnit})`,
        gridTemplateRows: `repeat(${dimensionality}, ${gridUnit})`
    };

    return (
        <div className="room" style={gridStyle} data-dimensionality={dimensionality}>
            {roomCoords}
        </div>
    );
}

export default Room;