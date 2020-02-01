import React, { useEffect } from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import PlayerGrid from '../../molecules/PlayerGrid';
import ActorGrid from '../../molecules/ActorGrid';
import TileGrid from '../../molecules/TileGrid';
import './Room.css';

const gridUnit = '1em';

const Room = ({roomIndex}) => {
    const [gameState, dispatchGameState] = useGameState();

    const ctx = 'Room';

    useEffect(() => {
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
    const handleTargetBeast = dispatchGameState;
    
    return (
        <div className="room">
            <PlayerGrid
                gridStyle={gridStyle}
                playerCoords={playerCoords}
            />
            <ActorGrid
                gridStyle={gridStyle}
                nearbyBeasts={nearbyBeasts}
                onClick={handleTargetBeast}
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