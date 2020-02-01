import React from 'react'
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import InventoryControls from '../../molecules/InventoryControls';
import './ControlsPanel.css';

const ControlsPanel = () => {
    const [gameState] = useGameState();

    return (
        <div className={`controls-panel${gameState.focusMode === 'inventory' ? ' active': ''}`}>
            {gameState.focusMode === 'inventory' && <InventoryControls/>}
        </div>
    );
}

export default ControlsPanel;