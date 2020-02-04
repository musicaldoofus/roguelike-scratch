import React, { createContext, useContext, useReducer, useMemo } from 'react';
import initGameState from '../initModels/initGameState';
import toCoords, { toIndex } from '../utilityLambdas/toCoords';
import rollDie from '../utilityLambdas/rollDie';
import generateMap from '../utilityLambdas/generateMap';

const GameStateContext = createContext();

const useGameState = () => {
    const ctx = useContext(GameStateContext);
    if (!ctx) {
        throw new Error(`must use within a ContextProvider`);
    }
    return ctx;
}

const handleTargetBeast = (gameState, action) => {
    const targetBeast = action.beast ? action.beast : action.targetBeast;
    const updatedBeast = Object.assign({}, targetBeast, {isTargeted: true});
    
    return {
        location: Object.assign({}, gameState.location, {
            targetState: false,
            nearbyBeasts: gameState.location.nearbyBeasts.filter(b => b.key !== targetBeast.key).map(b => Object.assign({}, b, {isTargeted: false})).concat(updatedBeast)
        })
    }
}

const addLog = (gameState, msgs) => {
    if (!msgs) throw new Error('Must include msgs');
    if (Array.isArray(msgs)) {
        msgs.forEach(msg => {
            if (!msg.ctx) throw new Error(`You must provide context in ${JSON.stringify(msg)}`);
        });
    }
    else if (!msgs.ctx)  throw new Error(`You must provide context in ${JSON.stringify(msgs)}`);
    const formattedMsgs = Array.isArray(msgs) ? msgs.map(({ctx, value}) => ({ctx, value: `${gameState.turn} : ${value}`})) : {ctx: msgs.ctx, value: `${gameState.turn} : ${msgs.value}`};
    
    return {
        log: Object.assign({}, gameState.log, {
            messages: gameState.log.messages.concat(formattedMsgs)
        })
    };
}

const handleMoveLevels = (gameState, action) => {
    const rooms = generateMap();
    const randomRoomIndex = Math.floor(Math.random() * rooms.length);
    const randomRoom = rooms[randomRoomIndex];
    const openSpacesInRoom = randomRoom.tiles.map(({tileType}, i) => ({tileType, i})).filter(({tileType}) => tileType === 'none').map(({i}) => i); //update - favor middle area of the room
    const targetTileIndex = Math.floor(Math.random() * openSpacesInRoom.length);
    const { x, y } = toCoords(openSpacesInRoom[targetTileIndex]);
    const nearbyBeasts = [];

    return {
        location: Object.assign({}, gameState.location, {
            rooms,
            level: action.toLevelIndex,
            nearbyBeasts
        }),
        player: Object.assign({}, gameState.player, {
            roomCoords: {
                x,
                y,
                roomIndex: randomRoomIndex
            }
        })
    };
}

const handleMoveRooms = (gameState, toRoomIndex/*, dir, fromEdge*/) => {
    const room = gameState.location.rooms[toRoomIndex];
    const portalDirections = Object.keys(room.portalIndices);
    const randomIndex = Math.floor(Math.random() * portalDirections.length);
    const targetTileDirection = portalDirections[randomIndex];
    const targetTileIndex = room.portalIndices[targetTileDirection]; //improve - "link" portals together to act as pointers, then develop tunnels (separate type of gameplay from caves)
    //console.log('room and targetTileIndex', room, targetTileIndex)
    const dimensionality = room.dimensionality;
    const { x, y } = toCoords(targetTileIndex, dimensionality);
    
    return {
        player: Object.assign({}, gameState.player, {
            roomCoords: {
                x,//: fromEdge === 'right' ? x + 1 : fromEdge === 'left' ? x - 1 : x,
                y,//: fromEdge === 'top' ? y + dimensionality : fromEdge === 'bottom' ? y - 1 : y,
                roomIndex: toRoomIndex
            }
        })
    };
}


const handleClearRoom = (gameState) => {
    return {
        turn: gameState.turn + 1,
        location: Object.assign({}, gameState.location, {
            nearbyBeasts: []
        })
    };
}

const handlePushBeastToRoom = (gameState, action) => {
    const loc = gameState.location;
    const room = loc.rooms[action.roomIndex];
    const dimensionality = room.dimensionality;
    const openTiles = room.tiles
        .map((tile, i) => tile.tileType === 'none' ? toCoords(i, dimensionality) : null) //improve - need to check if beast or player is on tile as well
        .filter(t => typeof t === 'object' ? t : false);
    const { x, y } = openTiles[Math.floor(Math.random() * openTiles.length)];
    const coords = {
        x,
        y,
        roomIndex: action.roomIndex
    };
    const updatedBeast = Object.assign({}, action.beast, { coords }); //extend - allow to check loc.rooms[loc.level - 1].beastGenerationRules
    
    return {
        location: Object.assign({}, gameState.location, {
            nearbyBeasts: loc.nearbyBeasts.filter(b => b.key !== action.beast.key).concat(updatedBeast)
        })
    };
}

const handleClickTile = (gameState, action) => {
    const beastOnTile = gameState.location.nearbyBeasts.filter(({coords}) => toIndex(coords) === action.index);
    const { x, y } = toCoords(action.index, gameState.location.rooms[gameState.player.roomCoords.roomIndex].dimensionality);

    return {
        ...addLog(gameState, {ctx: 'room', value: `You clicked tile ${action.index} at x: ${x}, y: ${y}`}),
        location: Object.assign({}, gameState.location, {
            nearbyBeasts: gameState.location.nearbyBeasts.map(b => Object.assign({}, b, {isTargeted: b.key === beastOnTile.key}))
        })
    };
}

const handleOpenTarget = (gameState) => {
    const targetState = true;
    
    return {
        location: Object.assign({}, gameState.location, {
            targetState
        })
    };
}

const handleMoveActor = (gameState, action) => {
    const dir = action.dir;
    const room = gameState.location.rooms[gameState.player.roomCoords.roomIndex];
    const dimensionality = room.dimensionality;
    const { x, y } = gameState.player.roomCoords;
    const dX = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
    const dY = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
    const tileIndex = toIndex({x: x + dX, y: y + dY}, dimensionality);
    const targetTile = room.tiles[tileIndex];

    if (!targetTile) return {}; //hack - happens due to placement issues on handleMoveRoom
    
    if (targetTile.tileType === 'wall') return addLog(gameState, {ctx: 'room', value: 'You kick the wall out of spite. Ow.'});

    if (targetTile.tileType === 'portal') {
        const edge = x + dX === dimensionality - 1 ? 'right' : x + dX === 0 ? 'left' : y + dY === dimensionality - 1 ? 'bottom' : 'top';
        return handleMoveRooms(gameState, targetTile.toRoomIndex, dir, edge);
    }

    if (targetTile.tileType === 'levelPortal') return handleMoveLevels(gameState, targetTile.toLevelIndex);

    const nearbyBeastsCoords = gameState.location.nearbyBeasts.map(({coords}) => toIndex(coords, dimensionality));
    if (nearbyBeastsCoords.indexOf(tileIndex) > -1) {
        const beastTarget = gameState.location.nearbyBeasts[nearbyBeastsCoords.indexOf(tileIndex)];
        const weapon = gameState.player.inventory.filter(item => item.type === 'weapon' && item.isEquipped)[0];
        const amtFromAttack = rollDie(weapon ? weapon.damage : `1d2+${gameState.player.baseStats.strength}`);
        const updatedBeast = Object.assign({}, beastTarget, {isTargeted: true, hp: beastTarget.hp - amtFromAttack >= 0 ? beastTarget.hp - amtFromAttack : 0});
        const msg = updatedBeast.hp > 0 ? `You attack the ${beastTarget.baseTitle}${weapon ? ` with a ${weapon.baseTitle}.` : ''}` : updatedBeast.dyingMessage;

        //update return value: conditionally return new array only if necessary (i.e. passthrough instead of construct new)
        return {
            ...addLog(gameState, {ctx: 'room', value: msg}),
            location: Object.assign({}, gameState.location, {
                nearbyBeasts: gameState.location.nearbyBeasts.filter(b => b.key !== updatedBeast.key).concat(updatedBeast.hp > 0 ? updatedBeast : [])
            })
        };
    }

    return {
        player: Object.assign({}, gameState.player, {
            roomCoords: {
                x: x + dX,
                y: y + dY,
                roomIndex: gameState.player.roomCoords.roomIndex
            }
        })
    };
}


const partialState = (gameState, action) => {
    switch (action.type) {
        case 'printGameState': return addLog(gameState, {ctx: 'console', value: 'Printed gameState'});

        case 'addLog': return addLog(gameState, action);

        case 'clearRoom': return handleClearRoom(gameState);

        case 'pushBeastToRoom': return handlePushBeastToRoom(gameState, action);

        case 'handleClickTile': return handleClickTile(gameState, action)

        case 'openTargetBeast': return handleOpenTarget(gameState);

        case 'handleTargetBeast': return handleTargetBeast(gameState, action);

        case 'handleMoveActor': return handleMoveActor(gameState, action);

        case 'adjustHP': {
            if (action.targetActor === 'npc') {
                const loc = gameState.location;
                const nearbyBeasts = loc.nearbyBeasts;
                const beastTarget = nearbyBeasts.filter(b => b.isTargeted)[0]; //extend to allow looping to damage/apply damage to other creatures (or consider one attack per beast in single dispatch call)
                
                const weapon = gameState.player.inventory.filter(item => item.type === 'weapon' && item.isEquipped)[0];
                const amtFromAttack = rollDie(weapon.damage);
                
                const updatedBeast = Object.assign({}, beastTarget, {hp: beastTarget.hp - amtFromAttack >= 0 ? beastTarget.hp - amtFromAttack : 0});
                const msg = updatedBeast.hp > 0 ? `You attack the ${updatedBeast.baseTitle}.` : updatedBeast.dyingMessage;
                const rollMsg = `Rolled ${weapon.damage} for ${amtFromAttack} damage.`;

                return {
                    ...addLog([{ctx: 'room', value: msg}, {ctx: 'roller', value: rollMsg}]),
                    location: Object.assign({}, gameState.location, {
                        nearbyBeasts: nearbyBeasts.filter(b => !b.isTargeted).concat(updatedBeast.hp > 0 ? updatedBeast : [])
                    })
                };
            }
            else return {
                player: Object.assign({}, gameState.player, {
                    vitalStats: Object.assign({}, gameState.player.vitalStats, {
                        hp: gameState.player.vitalStats.hp + action.amt
                    })
                })
            };
        }

        case 'handleToggleInventory': return {
            focusMode: gameState.focusMode === 'inventory' ? null : 'inventory'
        };

        case 'handleClosePanel': return {
            focusMode: null
        };

        case 'toggleConsole': return {
            focusMode: gameState.focusMode === 'console' ? null : 'console'
        };

        case 'applyAction': {
            const value = `You ${action.itmAction.type} the ${action.item.baseTitle}${action.target ? ` ${action.target.verb} the ${action.target.baseTitle}` : ''}.`;
            
            return {
                ...addLog(gameState, {ctx: 'room', value}),
                player: Object.assign({}, gameState.player, {
                    inventory: action.itmAction.doesRemove ? gameState.player.inventory.filter(item => item.key !== action.item.key) : gameState.player.inventory
                })
            };
        }

        default: throw new Error(`Must include a valid action.type in action ${JSON.stringify(action)}`);
    }
}

const gameStateReducer = (gameState, action) => Object.assign({}, gameState, partialState(gameState, action));

const GameStateProvider = (props) => {
    const [gameState, dispatchGameState] = useReducer(gameStateReducer, initGameState);
    const value = useMemo(() => [gameState, dispatchGameState], [gameState])
    return <GameStateContext.Provider value={value} {...props}/>;
}

export default GameStateProvider;
export { useGameState };