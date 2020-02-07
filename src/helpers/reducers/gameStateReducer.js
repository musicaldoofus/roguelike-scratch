import React, { createContext, useContext, useReducer, useMemo } from 'react';
import initGameState from '../initModels/initGameState';
import addLog, {
    handleClearRoom,
    handleClickTile,
    handleMoveActor,
    handleOpenTarget,
    handlePushBeastToRoom,
    handlePushActorNearby,
    handleTargetBeast,
    handleAdjustHp,
    handleMoveLevel
} from './partialReducers';

const GameStateContext = createContext();

const useGameState = () => {
    const ctx = useContext(GameStateContext);
    if (!ctx) {
        throw new Error(`must use within a ContextProvider`);
    }
    return ctx;
}

const partialReducer = (gameState, action) => {
    switch (action.type) {
        case 'printGameState': {
            console.log(gameState);
            return addLog(gameState, {ctx: 'console', value: 'Printed gameState'});
        }

        case 'addLog': return addLog(gameState, action);

        case 'clearRoom': return handleClearRoom(gameState);

        case 'pushBeastToRoom': return handlePushBeastToRoom(gameState, action);
        
        case 'pushActorToRoom': return handlePushActorNearby(gameState, action);

        case 'handleClickTile': return handleClickTile(gameState, action)

        case 'openTargetBeast': return handleOpenTarget(gameState);

        case 'handleTargetBeast': return handleTargetBeast(gameState, action);

        case 'handleMoveActor': return handleMoveActor(gameState, action);

        case 'adjustHP': return handleAdjustHp(gameState, action);

        case 'handleMoveLevel': return handleMoveLevel(gameState, action);

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

const gameStateReducer = (gameState, action) => Object.assign({}, gameState, partialReducer(gameState, action));

const GameStateProvider = (props) => {
    const [gameState, dispatchGameState] = useReducer(gameStateReducer, initGameState);
    const value = useMemo(() => [gameState, dispatchGameState], [gameState])
    return <GameStateContext.Provider value={value} {...props}/>;
}

export default GameStateProvider;
export { useGameState };