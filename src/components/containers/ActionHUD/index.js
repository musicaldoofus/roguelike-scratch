import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import TargetHUD from '../TargetHUD';
import './ActionHUD.css';

const ActionHUD = () => {
    const [gameState] = useGameState();

    const room = gameState.location.rooms[gameState.player.roomCoords.roomIndex];
    
    const roomStats = gameState.location.nearbyBeasts.filter(beast => beast.coords.roomIndex === gameState.player.roomCoords.roomIndex).length;
    const roomHUD = gameState.log.messages.filter(m => m.ctx === 'roomHUD');
    const roomHUDTip = roomHUD ? roomHUD[roomHUD.length - 1] : null;
    return (
        <div className="action-heads-up-display panel">
            <div>
                <div>Beasts in room: {roomStats}</div>
                <div>{roomHUDTip && roomHUDTip.value}</div>
            </div>
            <TargetHUD/>
        </div>
    );
}

export default ActionHUD;