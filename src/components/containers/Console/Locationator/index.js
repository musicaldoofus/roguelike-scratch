import React, { useState } from 'react';
import { useGameState } from '../../../../helpers/reducers/gameStateReducer';

const Locationator = () => {
    const [gameState, dispatchGameState] = useGameState();
    const [levelIndex, setLevelIndex] = useState(gameState.location.level);

    const ctx = 'locationator';

    const handleClearRoom = () => {
        dispatchGameState({
            ctx,
            type: 'clearRoom'
        });
    }

    const handleClearBattle = () => {
        dispatchGameState({
            ctx,
            type: 'clearBattle'
        });
    }

    const handleMoveLevel = () => {
        dispatchGameState({
            ctx,
            type: 'handleMoveLevel',
            levelIndex
        })
    }

    const handleLevelTarget = ({target}) => setLevelIndex(target.value);

    const {location} = gameState;
    const {nearbyBeasts} = location;
    return (
        <div className="locationator">
            <div>
                Current dungeon level: {gameState.location.level}
                <input type="number" value={levelIndex} onChange={handleLevelTarget}/>
                <button onClick={handleMoveLevel}>Set level index</button>
            </div>
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