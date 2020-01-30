import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';

const Locationator = () => {
    const [gameState, dispatchGameState] = useGameState();

    const ctx = 'locationator';

    const handleClearRoom = () => {
        dispatchGameState({
            ctx,
            type: 'clearRoom'
        });
        dispatchGameState({
            ctx,
            type: 'addLog',
            value: 'Cleared room'
        });
    }

    const handleClearBattle = () => {
        dispatchGameState({
            ctx,
            type: 'clearBattle'
        });
        dispatchGameState({
            ctx,
            type: 'addLog',
            value: 'Cleared battle'
        });
    }

    const {location} = gameState;
    const {nearbyBeasts} = location;
    return (
        <div className="locationator">
            {nearbyBeasts.length > 0 && (
                <button onClick={handleClearRoom}>
                    Clear Room
                </button>
            )}
            {nearbyBeasts.filter(b => b.isInBattle).length > 0 && (
                <button onClick={handleClearBattle}>
                    Clear Battle
                </button>
            )}
        </div>
    );
}

export default Locationator;