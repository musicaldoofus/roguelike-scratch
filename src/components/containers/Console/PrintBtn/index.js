import React from 'react';
import { useGameState } from '../../../../helpers/reducers/gameStateReducer';

const PrintBtn = () => {
    const [, dispatchGameState] = useGameState();
    const printGameState = () => dispatchGameState({
        ctx: 'printBtn',
        type: 'printGameState'
    });

    return (
        <div>
            <button onClick={printGameState}>Print GameState</button>
        </div>
    );
}

export default PrintBtn;