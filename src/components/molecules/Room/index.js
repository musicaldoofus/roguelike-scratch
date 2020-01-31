import React, { useEffect } from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import toCoords from '../../../helpers/utilityLambdas/toCoords';
import { BeastHealthBar } from '../Beast';
import './Room.css';

const Room = () => {
    const [gameState, dispatchGameState] = useGameState();

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.isComposing || e.keyCode === 229) return;
            if (arrowHandlerKeyCodes.indexOf(e.keyCode) > -1) handleArrowPress(e.keyCode);
            if (e.keyCode === 73) handleToggleInventory();
            if (e.keyCode === 27) handleToggleInventory(true);
            if (e.keyCode === 67) handleToggleConsole();
        });
    }, []);

    const ctx = 'room';

    const arrowHandlerKeyCodes = [
        37,
        38,
        39,
        40
    ];

    const handleArrowPress = (kCode) => {
        const dirFromCode = () => {
            switch (kCode) {
                case 37: return 'left';
                case 38: return 'up';
                case 39: return 'right';
                case 40: return 'down';
                default: {
                    throw new Error(`Invalid keyCode supplied ${JSON.stringify(kCode)}`);
                }
            }
        };
        dispatchGameState({
            ctx,
            type: 'handleMoveActor',
            dir: dirFromCode()
        });
    }

    const handleToggleConsole = () => dispatchGameState({
        ctx,
        type: 'toggleConsole'
    })

    const handleToggleInventory = (forceClose) => dispatchGameState({
        ctx,
        type: forceClose ? 'handleClosePanel' : 'handleToggleInventory'
    });

    const handleClickTile = (tile, index) => dispatchGameState({
        ctx,
        type: 'handleClickTile',
        tile,
        index
    });

    const tiles = gameState.location.rooms[0].tiles;
    const dimensionality = gameState.location.rooms[0].dimensionality;

    const roomCoords = tiles.map((tile, i) => {
        const tileCoords = toCoords(i, dimensionality); //improve - need to access roomIndex
        const beast = gameState.location.nearbyBeasts.filter(b => b.coords.x === tileCoords.x && b.coords.y === tileCoords.y)[0];
        const { x, y } = tileCoords;
        const gridAreaStyle = {
            gridColumn: `${x} / ${x + 1}`,
            gridRow: `${y} / ${y + 1}`
        };
        const player = gameState.player.roomCoords.x === x && gameState.player.roomCoords.y === y;
        return (
            <div key={`${x}_${y}`} className={`map-tile ${tile.tileType}`} onClick={() => handleClickTile(tile, i)}>
                {beast && (
                    <div className={`beast ${beast.baseTitle.replace(/\s/g, '-').toLowerCase()}${beast.isTargeted ? ' is-targeted' : ''}`} style={gridAreaStyle}>
                        <BeastHealthBar currHealth={beast.hp} maxHealth={4}/>
                    </div>
                )}
                {player && (
                    <div className={`player`} style={gridAreaStyle}></div>
                )}
            </div>
        );
    });

    const gridUnit = '1.5em'; //update - calculate: (get container width) => set font-size on container and use em to size gridUnit

    const gridStyle = {
        gridTemplateColumns: `repeat(${dimensionality}, ${gridUnit})`,
        gridTemplateRows: `repeat(${dimensionality}, ${gridUnit})`
    };

    return (
        <div className="room" style={gridStyle}>
            {roomCoords}
        </div>
    );
}

export default Room;