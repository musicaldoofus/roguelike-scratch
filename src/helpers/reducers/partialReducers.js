import toCoords, { toIndex } from '../utilityLambdas/toCoords';
import generateMap from '../utilityLambdas/generateMap';
import rollDie from '../utilityLambdas/rollDie';

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

const handleMoveLevel = (gameState, toLevelIndex) => {
    const rooms = generateMap(toLevelIndex);
    const randomRoomIndex = Math.floor(Math.random() * rooms.length);
    const randomRoom = rooms[randomRoomIndex];
    const openSpacesInRoom = randomRoom.tiles
        .map(({tileType}, i) => ({tileType, i}))
        .filter(({tileType}) => tileType === 'none')
        .map(({i}) => i); //update - favor middle area of the room
    //console.log('openSpacesInRoom', openSpacesInRoom)
    const targetTileIndex = Math.floor(Math.random() * openSpacesInRoom.length);
    const { x, y } = toCoords(openSpacesInRoom[targetTileIndex], randomRoom.dimensionality);
    const nearbyBeasts = [];

    return {
        location: Object.assign({}, gameState.location, {
            rooms,
            level: toLevelIndex,
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

const handleMoveRooms = (gameState, targetTile) => {
    console.log('handleMoveRooms', targetTile)
    return {
        player: Object.assign({}, gameState.player, {
            roomCoords: {
                roomIndex: targetTile.toRoomIndex,
                ...targetTile.toRoomCoords
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

const handlePushActorNearby = (gameState, action) => {
    if (action.actorType === 'beast') return handlePushBeastToRoom(gameState, action);
    const ally = {
        actorType: 'ally'
    };

    return {
        location: Object.assign({}, gameState.location, {
            nearbyBeasts: gameState.location.nearbyBeasts.concat(ally) 
        })
    }
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
    
    if (targetTile.tileType === 'wall' || targetTile.tileType === 'building') return addLog(gameState, {ctx: 'room', value: 'You kick the wall out of spite. Ow.'});

    if (targetTile.tileType === 'forest') return addLog(gameState, {ctx: 'room', value: 'The trees look a bit eery to go venturing out by yourself.'})

    if (targetTile.tileType === 'portal' || targetTile.tileType === 'bldgPortal' || targetTile.tileType === 'openPortal') return handleMoveRooms(gameState, targetTile);

    if (targetTile.tileType === 'levelPortal') return handleMoveLevel(gameState, targetTile.toLevelIndex);

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

const handleAdjustHp = (gameState, action) => {
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

export default addLog;
export {
    handleClearRoom,
    handleClickTile,
    handleMoveActor,
    handleMoveLevel,
    handleMoveRooms,
    handleOpenTarget,
    handlePushActorNearby,
    handlePushBeastToRoom,
    handleTargetBeast,
    handleAdjustHp
};