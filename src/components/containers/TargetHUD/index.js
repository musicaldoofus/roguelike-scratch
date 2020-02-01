import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './TargetHUD.css';

const beastTargetParams = /(baseTitle|scarcity|strength|hp|maxHp|elem|coords)/;

const TargetHUD = () => {
    const [gameState] = useGameState();

    const targetedObject = gameState.location.nearbyBeasts.filter(b => b.isTargeted)[0];
    return (
        <div className="target-heads-up-display">
            {targetedObject && (
                <div className="target-heads-up-display-inner-container">
                    {Object.keys(targetedObject).filter(k => beastTargetParams.test(k)).map(k => <div key={k}><b>{k}:</b> {JSON.stringify(targetedObject[k])}</div>)}
                </div>
            )}
        </div>
    );
}

export default TargetHUD;