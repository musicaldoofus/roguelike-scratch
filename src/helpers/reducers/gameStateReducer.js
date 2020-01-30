import React, { createContext, useContext, useReducer, useMemo } from 'react';
import initGameState from '../initModels/initGameState';
import beastDictionary from '../dictionaries/beastDictionary';
import toCoords, { toIndex } from '../utilityLambdas/toCoords';
import rollDie from '../utilityLambdas/rollDie';

/*
todo: add 'rolling' logic and compare functions for moves
*/

const GameStateContext = createContext();

const useGameState = () => {
    const ctx = useContext(GameStateContext);
    if (!ctx) {
        throw new Error(`must use within a ContextProvider`);
    }
    return ctx;
}

const gameStateReducer = (gameState, action) => {
    const filteredRest = (obj, filterKey) => Object.fromEntries(
        Object.keys(obj)
          .filter(key => !filterKey.test(key))
          .map(key => [key, obj[key]])
        );
    
    const gameRestFromLocation = filteredRest(gameState, /location/);
    
    const handleTargetBeast = (beast) => {
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
        //console.log('addMsg', msgs);
        if (!msgs) throw new Error('Must include msgs');
        if (Array.isArray(msgs)) {
            msgs.forEach(msg => {
                if (!msg.ctx) throw new Error(`You must provide context in ${JSON.stringify(msg)}`);
            });
        }
        else if (!msgs.ctx)  throw new Error(`You must provide context in ${JSON.stringify(msgs)}`);
        const gameRest = filteredRest(gameState, /log/);
        const logRest = filteredRest(gameState.log, /messages/);
        
        return {
            log: {
                messages: gameState.log.messages.concat([].concat(msgs)),
                ...logRest
            },
            ...gameRest
        };
    }
    
    const attackFrom = (params) => {
        return {
            
        };
    }

    switch (action.type) {
        case 'printGameState': {
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
                .map((tile, i) => tile.type === 'none' ? toCoords(i, dimensionality) : null) //improve - need to check if beast or player is on tile as well
                .filter(t => typeof t === 'object' ? t : false);
            const updatedBeast = Object.assign({}, action.beast, {coords: openTiles[Math.floor(Math.random() * openTiles.length)]}); //extend - allow to check loc.rooms[loc.level - 1].beastGenerationRules
            const nearbyBeasts = loc.nearbyBeasts.filter(b => b.key !== action.beast.key).concat(updatedBeast);
            
            return {
                location: {
                    nearbyBeasts,
                    ...locationRest
                },
                ...gameRest
            };
        }

        case 'handleClickTile': {
            const loc = gameState.location;
            const dimensionality = loc.rooms[loc.level - 1].dimensionality;
            const beastOnTile = loc.nearbyBeasts.filter(({coords}) => {
                const tileCoords = toCoords(action.index, dimensionality);
                return coords.x === tileCoords.x && coords.y === tileCoords.y;
            });

            if (beastOnTile.length > 0) return handleTargetBeast(beastOnTile[0]);
            else return addLog({ctx: 'roomHUD', value: JSON.stringify(action.tile)});
        }

        case 'handleMoveActor': {
            //assume player for first iteration to test handlers
            //const actor = 'player';
            const dir = action.dir;
            const room = gameState.location.rooms[gameState.location.level - 1];
            const dimensionality = room.dimensionality;
            const { x, y } = gameState.player.roomCoords;
            if ((dir === 'up' && y === 1)
                || (dir === 'right' && x === dimensionality - 2) //confirm
                || (dir === 'left' && x === 1)
                || (dir === 'down' && y === dimensionality - 2)
                ) return addLog({ctx: 'room', value: 'You bump into a wall.'});
            const dX = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
            const dY = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
            const targetTile = room.tiles[toIndex({x: x + dX, y: y + dY}, dimensionality)];
            if (targetTile.type !== 'none') return addLog({ctx: 'room', value: 'Whups!'});
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

        case 'openTargetBeast': {
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

        case 'adjustHP': { //consider modifying to 'adjustStat'
            if (action.targetActor === 'npc') {
                const loc = gameState.location;
                const nearbyBeasts = loc.nearbyBeasts;
                const locationRest = filteredRest(loc, /nearbyBeasts/);
                const beastTarget = nearbyBeasts.filter(b => b.isTargeted)[0]; //extend to allow looping to damage/apply damage to other creatures (or consider one attack per beast in single dispatch call)
                
                const weapon = gameState.player.inventory.filter(item => item.type === 'weapon' && item.isEquipped)[0];
                const amtFromAttack = rollDie(weapon.damage);
                
                const updatedBeast = Object.assign({}, beastTarget, {hp: beastTarget.hp - amtFromAttack});
                const msg = updatedBeast.hp > 0 ? `You attack the ${updatedBeast.baseTitle}.` : beastDictionary[updatedBeast.baseTitle].dyingMessage;
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
            const gameRest = filteredRest(gameState, /focusMode/);
            const focusMode = gameState.focusMode === 'inventory' ? null : 'inventory';
            
            return {
                focusMode,
                ...gameRest
            };
        }

        case 'handleClosePanel': {
            const gameRest = filteredRest(gameState, /focusMode/);
            
            return {
                focusMode: null,
                ...gameRest
            }
        }

        case 'toggleConsole': {
            const gameRest = filteredRest(gameState, /focusMode/);
            const focusMode = gameState.focusMode === 'console' ? null : 'console'
            
            return {
                focusMode,
                ...gameRest
            }
        }

        case 'applyAction': {
            const value = `You ${action.itmAction.type} the ${action.item.baseTitle}${action.target ? ` ${action.target.verb} the ${action.target.baseTitle}` : ''}.`;
            const gameRest = filteredRest(addLog({value}), /player/);
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