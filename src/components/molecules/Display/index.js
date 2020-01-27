import React, { useState } from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';

const MsgAdder = () => {
    const [, dispatch] = useGameState();
    const [msgValue, setMsgValue] = useState(''); //use to avoid switching between controlled/uncontrolled in <input>
    const handleMsgOnChange = ({target}) => setMsgValue(target.value);

    const addMsg = () => dispatch({
        type: 'addLog',
        ctx: 'console',
        value: msgValue
    });

    return (
        <div className="message-adder">
            <h3>Log Adder</h3>
            <input type="text" value={msgValue} onChange={handleMsgOnChange}/>
            <button onClick={addMsg}>Add msg</button>
        </div>
    );
}

const Display = () => {
    const [gameState] = useGameState();
    const [ctxFocus, setCtxFocus] = useState('inventory');
    
    const displayTypes = [
        'general',
        'inventory',
        'battle',
        'roller',
        'beasterator',
        'battlepod',
        'console'
    ];

    const handleFilterClick = (t) => setCtxFocus(t);

    const display = gameState.log.messages
        .filter(({ctx}) => ctxFocus === 'general' ? true : ctx === ctxFocus)
        .map((m, i) => (
            <div key={m.value.concat(i)}>
                {m.value}
            </div>
        ));
    const filterButtons = displayTypes.map(t => (
        <button className={`filter-btn${ctxFocus === t ? ' active' : ''}`} key={t} onClick={() => handleFilterClick(t)}>
            {t}
        </button>
    ));

    return (
        <div className="message-display">
            <div className="message-display-body">
                {display}
            </div>
            <div className="message-display-filter-btns">
                {filterButtons}
            </div>
        </div>
    );
}

export default Display;
export { MsgAdder };