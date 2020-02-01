import React, { useEffect, useMemo } from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import Cell from '../Cell';
import { BeastHealthBar } from '../Beast';
import './Room.css';

const gridUnit = '1em';

const BeastInnerCell = ({beast, gridAreaStyle}) => {
    console.log('render <BeastInnerCell>');
    return (
        <div className={`beast ${beast.baseTitle.replace(/\s/g, '-').toLowerCase()}${beast.isTargeted ? ' is-targeted' : ''}`} style={gridAreaStyle}>
            <BeastHealthBar currHealth={beast.hp} maxHealth={4}/>
        </div>
    );
}

const PlayerInnerCell = ({gridAreaStyle}) => <div className={`player`} style={gridAreaStyle}></div>;

//<TileGrid> renders a group of tiles.
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

const PlayerGrid = ({gridStyle, playerCoords}) => {
    const gridAreaStyle = {
        gridColumn: `${playerCoords.x} / ${playerCoords.x + 1}`,
        gridRow: `${playerCoords.y} / ${playerCoords.y + 1}`                
    };
    return (
        <div className="room-grid player-grid" style={gridStyle}>
            <PlayerInnerCell playerCoords={playerCoords} gridAreaStyle={gridAreaStyle}/>
        </div>
    );
}

const ActorGrid = ({gridStyle, nearbyBeasts}) => {
    return (
        <div className="room-grid actor-grid" style={gridStyle}>
            {nearbyBeasts.length > 0 && (
                nearbyBeasts.map(b => {
                    const beastGridAreaStyle = {
                        gridColumn: `${b.coords.x} / ${b.coords.x + 1}`,
                        gridRow: `${b.coords.y} / ${b.coords.y + 1}`                
                    };
                    return <BeastInnerCell key={''.concat(b.coords.x).concat(b.coords.y)} beast={b} gridAreaStyle={beastGridAreaStyle}/>
                })
            )}
        </div>
    );
}

const Room = ({roomIndex}) => {
    const [gameState, dispatchGameState] = useGameState();

    const ctx = 'Room';

    useEffect(() => {
        console.log('useEffect in <Room>');

        const handleToggleConsole = () => dispatchGameState({
            ctx,
            type: 'toggleConsole'
        });
        const handleToggleInventory = (forceClose) => dispatchGameState({
            ctx,
            type: forceClose ? 'handleClosePanel' : 'handleToggleInventory'
        });
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
        };

        const arrowHandlerKeyCodes = [
            37,
            38,
            39,
            40
        ];
    
        window.addEventListener('keydown', (e) => {
            if (e.isComposing || e.keyCode === 229) return;
            if (arrowHandlerKeyCodes.indexOf(e.keyCode) > -1) handleArrowPress(e.keyCode);
            if (e.keyCode === 73) handleToggleInventory();
            if (e.keyCode === 27) handleToggleInventory(true);
            if (e.keyCode === 67) handleToggleConsole();
        });
    }, [dispatchGameState]);

    const room = gameState.location.rooms[roomIndex];
    const dimensionality = room.dimensionality;
    const tiles = room.tiles;
    const gridStyle = {
        gridTemplateColumns: `repeat(${dimensionality}, ${gridUnit})`,
        gridTemplateRows: `repeat(${dimensionality}, ${gridUnit})`
    };
    const playerCoords = gameState.player.roomCoords;
    const nearbyBeasts = gameState.location.nearbyBeasts;
    
    return (
        <div className="room">
            <PlayerGrid
                gridStyle={gridStyle}
                playerCoords={playerCoords}
            />
            <ActorGrid
                gridStyle={gridStyle}
                nearbyBeasts={nearbyBeasts}
            />
            <TileGrid
                gridStyle={gridStyle}
                tiles={tiles}
                roomIndex={roomIndex}
                handleClickTile={dispatchGameState}
            />
        </div>
    );
}

export default Room;