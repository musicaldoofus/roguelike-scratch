import React, { useEffect } from 'react';
import Beast from '../../molecules/Beast';
import PlayerDisplay from '../../molecules/PlayerDisplay';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './BattlePod.css';

const BattlePod = () => {
    const [gameState, dispatchGameState] = useGameState();

    const ctx = 'battlepod';

    useEffect(() => {
        dispatchGameState({
            type: 'addLog',
            ctx,
            value: 'Initialized <BattlePod>'
        });
    }, []);

    const clearBattlePod = () => {
        dispatchGameState({
            ctx,
            type: 'clearBattlePod'
        });
        dispatchGameState({
            ctx,
            type: 'addLog',
            value: 'Cleared <BattlePod>'
        })
    }

    const battleBeast = gameState.location.nearbyBeasts.filter(b => b.isInBattle)[0];

    return (
        <div className="battle-pod">
            <button onClick={clearBattlePod}>Clear BattlePod</button>
            <div className="beast-display">
                {battleBeast && <Beast beast={battleBeast}/>}
            </div>
            <PlayerDisplay/>
        </div>
    );
}

export default BattlePod;