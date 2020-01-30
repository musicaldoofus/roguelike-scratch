import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';

const PrintBtn = () => {
    const [state] = useGameState();
    const printGameState = () => console.log('p', state);

    return (
        <div>
            <button onClick={printGameState}>Print GameState</button>
        </div>
    );
}

export default PrintBtn;