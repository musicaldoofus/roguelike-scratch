import React from 'react'
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import InventoryControls from '../../molecules/InventoryControls';
import PlayerBattleControls from '../../molecules/PlayerBattleControls';
import './ControlsPanel.css';

const ControlsPanel = () => {
    const [gameState] = useGameState();

    const targetedBeasts = gameState.location.nearbyBeasts.filter(b => b.isTargeted);
    return (
        <div className={`controls-panel${targetedBeasts.length > 0 || gameState.focusMode === 'inventory' ? ' active': ''}`}>
            {targetedBeasts.length > 0 && <PlayerBattleControls/>}
            {gameState.focusMode === 'inventory' && <InventoryControls/>}
        </div>
    );
}

export default ControlsPanel;