import React, { createContext, useContext, useReducer, useMemo } from 'react';
import initGameState from '../initGameState';

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
          .filter(key => key !== filterKey)
          .map(key => [key, obj[key]])
        );
    switch (action.type) {
        case 'addLog': {
            if (action.value === '') {
                console.warn(`Log ignored. Must supply a valid String for ${JSON.stringify(action)}`);
                return gameState;
            }
            const gameRest = filteredRest(gameState, 'log');
            const logRest = filteredRest(gameState.log, 'messages');
            const {ctx, value} = action;
            const log = {
                messages: gameState.log.messages.concat({
                    ctx,
                    value
                }),
                ...logRest
            };
            return {
                log,
                ...gameRest
            }
        }

        case 'clearBattlePod': {
            const gameRest = filteredRest(gameState, 'location');
            const locationRest = filteredRest(gameState.location, 'nearbyBeasts');
            const nearbyBeasts = gameState.location.nearbyBeasts.map((b, i) => {
                const beastRest = filteredRest(gameState.location.nearbyBeasts[i], 'isInBattle');
                return {
                    isInBattle: false,
                    ...beastRest
                }
            });
            const location = {
                nearbyBeasts,
                ...locationRest
            };
            return {
                location,
                ...gameRest
            };
        }

        case 'pushBeastToBattle': {
            const gameRest = filteredRest(gameState, 'location');
            const locationRest = filteredRest(gameState.location, 'nearbyBeasts');
            const beastRest = filteredRest(action.beast, 'isInBattle');
            const beast = {
                isInBattle: true,
                ...beastRest
            }
            const nearbyBeasts = gameState.location.nearbyBeasts.concat(beast);
            const location = {
                nearbyBeasts,
                ...locationRest
            };
            return {
                location,
                ...gameRest
            };
        }

        case 'adjustHP': {
            if (action.targetActor === 'npc') {
                const gameRest = filteredRest(gameState, 'location');
                const locationRest = filteredRest(gameState.location, 'nearbyBeasts');
                const beastTarget = gameState.location.nearbyBeasts.filter(b => b.isInBattle)[0];
                beastTarget.hp += action.amt;
                const restBeasts = gameState.location.nearbyBeasts.filter(b => !b.isInBattle);
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
                    ...gameRest
                }
            }
            else {
                const gameRest = filteredRest(gameState, 'player');
                const playerRest = filteredRest(gameState.player, 'vitalStats');
                const vitalStatsRest = filteredRest(gameState.player.vitalStats, 'hp');
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