import React, { createContext, useContext, useReducer, useMemo } from 'react';
import initGameState from '../initGameState';
import toCoords, { toIndex } from '../toCoords';

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
        const targetState = false;
        const updatedBeast = Object.assign({}, targetBeast, {isTargeted: true});
        const otherBeasts = gameState.location.nearbyBeasts.filter(b => b.key !== targetBeast.key).map(b => Object.assign({}, b, {isTargeted: false}));
        const nearbyBeasts = otherBeasts.concat(updatedBeast);
        const location = {
            targetState,
            nearbyBeasts,
            ...locationRest
        }
        return {
            ...gameRestFromLocation,
            location
        }
    }
    const addLog = (msg) => {
        if (action.value === '') {
            console.warn(`Log ignored. Must supply a valid String for ${JSON.stringify(action)}`);
            return gameState;
        }
        const gameRest = filteredRest(gameState, /log/);
        const {ctx, value} = action;
        const log = {
            messages: gameState.log.messages.concat({
                ctx,
                value: msg ? JSON.stringify(msg) : `[${ctx}] ${value}`
            })
        };
        return {
            log,
            ...gameRest
        };
    }

    switch (action.type) {
        case 'addLog': return addLog();

        case 'clearRoom': {
            const gameRest = filteredRest(gameState, /location/);
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
            const dimensionality = gameState.location.rooms[action.roomIndex].dimensionality;
            const locationRest = filteredRest(gameState.location, /(nearbyBeasts)/);
            const openTiles = gameState.location.rooms[action.roomIndex].tiles
                .map((tile, i) => tile.type === 'none' ? toCoords(i, dimensionality) : null) //improve - need to check if beast or player is on tile as well
                .filter(t => typeof t === 'object' ? t : false);
            const randomTileIndex = Math.floor(Math.random() * openTiles.length); //extend - allow to check loc.rooms[loc.level - 1].beastGenerationRules
            const updatedBeast = Object.assign({}, action.beast, {coords: openTiles[randomTileIndex]});
            const nearbyBeasts = gameState.location.nearbyBeasts.filter(b => b.key !== action.beast.key).concat(updatedBeast);
            return {
                location: {
                    nearbyBeasts,
                    ...locationRest
                },
                ...gameRestFromLocation
            };
        }

        case 'handleClickTile': {
            const loc = gameState.location;
            const dimensionality = loc.rooms[loc.level - 1].dimensionality;
            const beastOnTile = loc.nearbyBeasts.filter(({coords}) => {
                const check = toCoords(action.index, dimensionality);
                return coords.x === check.x && coords.y === check.y;
            });
            if (beastOnTile.length > 0) return handleTargetBeast(beastOnTile[0]);
            else return addLog(action.tile);
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
                ) return addLog('You bump into a wall.');
            const dX = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
            const dY = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
            const targetTile = room.tiles[toIndex({x: x + dX, y: y + dY}, dimensionality)];
            if (targetTile.type !== 'none') return addLog('Whups!');
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

        case 'handleTargetBeast': {
            return handleTargetBeast();
        }

        case 'adjustHP': { //consider modifying to 'adjustStat'
            if (action.targetActor === 'npc') {
                const locationRest = filteredRest(gameState.location, /nearbyBeasts/);
                const beastTarget = gameState.location.nearbyBeasts.filter(b => b.isTargeted)[0]; //extend to allow looping to damage/apply damage to other creatures (or consider one attack per beast in single dispatch call)
                const restBeasts = gameState.location.nearbyBeasts.filter(b => !b.isTargeted);
                beastTarget.hp += action.amt;
                return {
                    location: {
                        nearbyBeasts: [
                            beastTarget,
                            ...restBeasts
                        ],
                        ...locationRest
                    },
                    ...gameRestFromLocation
                }
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

        default: {
            throw new Error(`Must include a valid action.type in action ${JSON.stringify(action)}`);
        }
    }
}

const GameStateProvider = (props) => {
    const [gameState, dispatchGameState] = useReducer(gameStateReducer, initGameState);
    const value = useMemo(() => [gameState, dispatchGameState], [gameState])
    return <GameStateContext.Provider value={value} {...props}/>;
}

export default GameStateProvider;
export { useGameState };