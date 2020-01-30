import React, { createContext, useContext, useReducer, useMemo } from 'react';
import initGameState from '../initGameState';
import toCoords from '../toCoords';

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
            const location = {
                nearbyBeasts: [],
                ...locationRest
            };
            return {
                location,
                ...gameRest
            };
        }

        case 'pushBeastToRoom': {
            const dimensionality = gameState.location.rooms[action.roomIndex].dimensionality;
            const locationRest = filteredRest(gameState.location, /(nearbyBeasts)/);
            const openTiles = gameState.location.rooms[action.roomIndex].tiles
                .map((tile, i) => tile.type === 'none' ? toCoords(i, dimensionality) : null) //improve - need to check if beast is on tile as well
                .filter(t => typeof t === 'object' ? t : false);
            const randomTileIndex = Math.floor(Math.random() * openTiles.length);
            const updatedBeast = Object.assign({}, action.beast, {coords: openTiles[randomTileIndex]});
            const nearbyBeasts = gameState.location.nearbyBeasts.filter(b => b.key !== action.beast.key).concat(updatedBeast);
            const location = {
                nearbyBeasts,
                ...locationRest
            };
            return {
                location,
                ...gameRestFromLocation
            };
        }

        case 'handleClickTile': {
            const dimensionality = gameState.location.rooms[0].dimensionality;
            const beastOnTile = gameState.location.nearbyBeasts.filter(({coords}) => {
                const check = toCoords(action.index, dimensionality)
                console.log('check coords', coords, check);
                return coords.x === check.x && coords.y === check.y;
            });
            console.log('clicked tile, found beast ?', beastOnTile);
            if (beastOnTile.length > 0) return handleTargetBeast(beastOnTile[0]);
            else return addLog(action.tile);
        }

        case 'openTargetBeast': {
            const locationRest = filteredRest(gameState.location, /targetState/);
            const targetState = true;
            const location = {
                targetState,
                ...locationRest
            };
            return {
                location,
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
                beastTarget.hp += action.amt;
                const restBeasts = gameState.location.nearbyBeasts.filter(b => !b.isTargeted);
                const nearbyBeasts = [
                    beastTarget,
                    ...restBeasts
                ];
                const location = {
                    nearbyBeasts,
                    ...locationRest
                };
                return {
                    location,
                    ...gameRestFromLocation
                }
            }
            else {
                const gameRest = filteredRest(gameState, /player/);
                const playerRest = filteredRest(gameState.player, /vitalStats/);
                const vitalStatsRest = filteredRest(gameState.player.vitalStats, /hp/);
                const vitalStats = {
                    hp: gameState.player.vitalStats.hp + action.amt,
                    ...vitalStatsRest
                };
                const player = {
                    vitalStats,
                    ...playerRest
                };
                return {
                    player,
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