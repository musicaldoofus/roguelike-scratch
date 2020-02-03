import React, { useMemo } from 'react';
import Room from '../Room';
import './ActionDisplay.css';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';

const ActionDisplay = () => {
    //console.log('Invoke <ActionDisplay>');
    const [gameState] = useGameState();

    const roomIndex = gameState.player.roomCoords.roomIndex;
    const display = useMemo(() => {
        //console.log('useMemo for <Room> within <ActionDisplay>', roomIndex, typeof roomIndex);
        return <Room roomIndex={roomIndex}/>
    }, [
        roomIndex
    ]);

    return (
        <div className="action-display">
            {display}
        </div>
    );
}

export default ActionDisplay;