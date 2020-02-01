import React, { createContext, useContext, useReducer, useMemo } from 'react';
import initGameState from '../initModels/initGameState';
import toCoords, { toIndex } from '../utilityLambdas/toCoords';
import rollDie from '../utilityLambdas/rollDie';

const GameStateContext = createContext();

const useGameState = () => {
    const ctx = useContext(GameStateContext);
    if (!ctx) {
        throw new Error(`must use within a ContextProvider`);
    }
    return ctx;
}

const gameStateReducer = (gameState, action) => {
    gameState.turn += 1 ; //find a performant way to do this without mutation
    const filteredRest = (obj, filterKey) => Object.fromEntries(
        Object.keys(obj)
          .filter(key => !filterKey.test(key))
          .map(key => [key, obj[key]])
        );
    
    const gameRestFromLocation = filteredRest(gameState, /location/);
    
    const handleTargetBeast = (beast = action.beast) => {
        //if (!beast) throw new Error(`Must supply valid beast obj in handleTargetBeast`);
        gameState.turn -= 1;
        const targetBeast = beast ? beast : action.targetBeast;
        const locationRest = filteredRest(gameState.location, /(nearbyBeasts|targetState)/);
        const gameRest = filteredRest(addLog({ctx: 'room', value: `Targeting ${targetBeast.baseTitle}.`}), /location/);
        const updatedBeast = Object.assign({}, targetBeast, {isTargeted: true});
        
        return {
            location: {
                targetState: false,
                nearbyBeasts: gameState.location.nearbyBeasts.filter(b => b.key !== targetBeast.key).map(b => Object.assign({}, b, {isTargeted: false})).concat(updatedBeast),
                ...locationRest
            },
            ...gameRest
        }
    }

    const addLog = (msgs) => {
        if (!msgs) throw new Error('Must include msgs');
        if (Array.isArray(msgs)) {
            msgs.forEach(msg => {
                if (!msg.ctx) throw new Error(`You must provide context in ${JSON.stringify(msg)}`);
            });
        }
        else if (!msgs.ctx)  throw new Error(`You must provide context in ${JSON.stringify(msgs)}`);
        const gameRest = filteredRest(gameState, /log/);
        const logRest = filteredRest(gameState.log, /messages/);
        
        const formattedMsgs = Array.isArray(msgs) ? msgs.map(({ctx, value}) => ({ctx, value: `${gameState.turn} : ${value}`})) : {ctx: msgs.ctx, value: `${gameState.turn} : ${msgs.value}`};
        
        return {
            log: {
                messages: gameState.log.messages.concat(formattedMsgs),
                ...logRest
            },
            ...gameRest
        };
    }

    switch (action.type) {
        case 'printGameState': {
            gameState.turn -= 1
            console.log('print gameState', gameState);
            return addLog({ctx: 'console', value: 'Printed gameState'});
        }

        case 'addLog': return addLog(action);

        case 'clearRoom': {
            const gameRest = filteredRest(addLog({ctx: 'console', value: 'Cleared the room.'}), /location/);
            const locationRest = filteredRest(gameState.location, /nearbyBeasts/);
            
            return {
                location: {
                    nearbyBeasts: [],
                    ...locationRest
                },
                ...gameRest
            };
        }

        case 'pushBeastToRoom': {
            const gameRest = filteredRest(addLog({ctx: 'console', value: `Pushing ${action.beast.baseTitle} to the room.`}), /location/);
            const loc = gameState.location;
            const room = loc.rooms[action.roomIndex];
            const dimensionality = room.dimensionality;
            const locationRest = filteredRest(loc, /(nearbyBeasts)/);
            const openTiles = room.tiles
                .map((tile, i) => tile.tileType === 'none' ? toCoords(i, dimensionality) : null) //improve - need to check if beast or player is on tile as well
                .filter(t => typeof t === 'object' ? t : false);
            const updatedBeast = Object.assign({}, action.beast, {coords: openTiles[Math.floor(Math.random() * openTiles.length)]}); //extend - allow to check loc.rooms[loc.level - 1].beastGenerationRules
            
            return {
                location: {
                    nearbyBeasts: loc.nearbyBeasts.filter(b => b.key !== action.beast.key).concat(updatedBeast),
                    ...locationRest
                },
                ...gameRest
            };
        }

        case 'handleClickTile': {
            console.log('handleCT');
            gameState.turn -= 1; //hack
            const gameRest = filteredRest(addLog({ctx: 'roomHUD', value: `Clicked tile ${action.index}.`}), /location/);
            const locationRest = filteredRest(gameState.location, /nearbyBeasts/);
            return {
                location: {
                    nearbyBeasts: gameState.location.nearbyBeasts.map(b => Object.assign({}, b, {isTargeted: false})),
                    ...locationRest
                },
                ...gameRest
            }
        }

        case 'openTargetBeast': {
            gameState.turn -= 1
            const locationRest = filteredRest(gameState.location, /targetState/);
            const targetState = true;
            
            return {
                location: {
                    targetState,
                    ...locationRest
                },
                ...gameRestFromLocation
            };
        }

        case 'handleTargetBeast': return handleTargetBeast();

        case 'handleMoveActor': {
            //assume player for first iteration to test handlers
            //const actor = 'player';
            const dir = action.dir;
            const room = gameState.location.rooms[gameState.location.level - 1];
            const dimensionality = room.dimensionality;
            const { x, y } = gameState.player.roomCoords;
            const dX = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
            const dY = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
            const tileIndex = toIndex({x: x + dX, y: y + dY}, dimensionality);
            const targetTile = room.tiles[tileIndex];
            if (targetTile.tileType === 'wall') {
                return addLog({ctx: 'room', value: 'You kick the wall out of spite. Ow.'});
            }
            const nearbyBeastsCoords = gameState.location.nearbyBeasts.map(({coords}) => toIndex(coords, dimensionality));
            if (nearbyBeastsCoords.indexOf(tileIndex) > -1) {
                const beastTarget = gameState.location.nearbyBeasts[nearbyBeastsCoords.indexOf(tileIndex)];
                const weapon = gameState.player.inventory.filter(item => item.type === 'weapon' && item.isEquipped)[0];
                const amtFromAttack = rollDie(weapon.damage);
                const updatedBeast = Object.assign({}, beastTarget, {isTargeted: true, hp: beastTarget.hp - amtFromAttack >= 0 ? beastTarget.hp - amtFromAttack : 0});
                const msg = updatedBeast.hp > 0 ? `You attack the ${beastTarget.baseTitle}` : updatedBeast.dyingMessage;
                const gameRest = filteredRest(addLog({ctx: 'room', value: msg}), /location/);
                const locationRest = filteredRest(gameState.location, /nearbyBeasts/);

                return {
                    location: {
                        nearbyBeasts: gameState.location.nearbyBeasts.filter(b => b.key !== updatedBeast.key).concat(updatedBeast.hp > 0 ? updatedBeast : []),
                        ...locationRest
                    },
                    ...gameRest
                };
            }
            const gameRest = filteredRest(gameState, /player/);
            const playerRest = filteredRest(gameState.player, /roomCoords/);
           
            return {
                player: {
                    roomCoords: {
                        x: x + dX,
                        y: y + dY
                    },
                    ...playerRest
                },
                ...gameRest
            };
        }

        case 'adjustHP': { //consider modifying to 'adjustStat'
            if (action.targetActor === 'npc') {
                const loc = gameState.location;
                const nearbyBeasts = loc.nearbyBeasts;
                const locationRest = filteredRest(loc, /nearbyBeasts/);
                const beastTarget = nearbyBeasts.filter(b => b.isTargeted)[0]; //extend to allow looping to damage/apply damage to other creatures (or consider one attack per beast in single dispatch call)
                
                const weapon = gameState.player.inventory.filter(item => item.type === 'weapon' && item.isEquipped)[0];
                const amtFromAttack = rollDie(weapon.damage);
                
                const updatedBeast = Object.assign({}, beastTarget, {hp: beastTarget.hp - amtFromAttack >= 0 ? beastTarget.hp - amtFromAttack : 0});
                const msg = updatedBeast.hp > 0 ? `You attack the ${updatedBeast.baseTitle}.` : updatedBeast.dyingMessage;
                const rollMsg = `Rolled ${weapon.damage} for ${amtFromAttack} damage.`;
                const gameRest = filteredRest(addLog([{ctx: 'room', value: msg}, {ctx: 'roller', value: rollMsg}]), /(location)/);
                
                return {
                    location: {
                        nearbyBeasts: nearbyBeasts.filter(b => !b.isTargeted).concat(updatedBeast.hp > 0 ? updatedBeast : []),
                        ...locationRest
                    },
                    ...gameRest
                };
            }
            else {
                const gameRest = filteredRest(gameState, /player/);
                const playerRest = filteredRest(gameState.player, /vitalStats/);
                const vitalStatsRest = filteredRest(gameState.player.vitalStats, /hp/);
                
                return {
                    player: {
                        vitalStats: {
                            hp: gameState.player.vitalStats.hp + action.amt,
                            ...vitalStatsRest
                        },
                        ...playerRest
                    },
                    ...gameRest
                }
            }
        }

        case 'handleToggleInventory': {
            gameState.turn -= 1
            const gameRest = filteredRest(gameState, /focusMode/);
            
            return {
                focusMode: gameState.focusMode === 'inventory' ? null : 'inventory',
                ...gameRest
            };
        }

        case 'handleClosePanel': {
            gameState.turn -= 1
            const gameRest = filteredRest(gameState, /focusMode/);
            
            return {
                focusMode: null,
                ...gameRest
            }
        }

        case 'toggleConsole': {
            gameState.turn -= 1
            const gameRest = filteredRest(gameState, /focusMode/);
            const focusMode = gameState.focusMode === 'console' ? null : 'console'
            
            return {
                focusMode,
                ...gameRest
            }
        }

        case 'applyAction': {
            const value = `You ${action.itmAction.type} the ${action.item.baseTitle}${action.target ? ` ${action.target.verb} the ${action.target.baseTitle}` : ''}.`;
            const gameRest = filteredRest(addLog({ctx: 'room', value}), /player/);
            const playerRest = filteredRest(gameState.player, /inventory/);
            return {
                player: {
                    inventory: action.itmAction.doesRemove ? gameState.player.inventory.filter(item => item.key !== action.item.key) : gameState.player.inventory,
                    ...playerRest
                },
                ...gameRest
            }
        }

        default: throw new Error(`Must include a valid action.type in action ${JSON.stringify(action)}`);
    }
}

const GameStateProvider = (props) => {
    const [gameState, dispatchGameState] = useReducer(gameStateReducer, initGameState);
    const value = useMemo(() => [gameState, dispatchGameState], [gameState])
    return <GameStateContext.Provider value={value} {...props}/>;
}

export default GameStateProvider;
export { useGameState };