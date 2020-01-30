import React, { useState } from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './Log.css';

const Log = () => {
    const [gameState] = useGameState();
    const [ctxFocus, setCtxFocus] = useState('general');
    const [activeViewIndex, setActiveViewIndex] = useState(0);
    
    const displayTypes = [
        'general',
        'inventory',
        'battle',
        'roller',
        'beasterator',
        'battlepod',
        'console'
    ];

    const handleFilterClick = (t) => {
        adjustViewIndex();
        setCtxFocus(t);
    }

    const messages = gameState.log.messages;
    const VIEW_LIMIT = 11;

    const adjustViewIndex = (amt) => {
        if (activeViewIndex + amt < 0 || activeViewIndex + amt > messages.length - 1) return;
        setActiveViewIndex(amt ? activeViewIndex + amt : 0);
    }
    
    const endIndex = messages.length - activeViewIndex;
    const begIndex = endIndex >= VIEW_LIMIT ?
        endIndex - VIEW_LIMIT
        : 0;
    const logMessages = messages
        .filter(({ctx}) => ctxFocus === 'general' ? true : ctx === ctxFocus)
        .slice(begIndex, endIndex)
        .map((m, i) => (
            <div key={m.value.concat(i)}>
                <span>{m.value}</span>
            </div>
        ));
    const filterButtons = displayTypes.map(t => (
        <button className={`filter-btn${ctxFocus === t ? ' active' : ''}`} key={t} onClick={() => handleFilterClick(t)}>
            <span>{t}</span>
        </button>
    ));

    return (
        <div className="log">
            <div className="log-body">
                <div className="log-body-inner-container">
                    {logMessages}
                </div>
                <div className="log-body-view-index-btns">
                    <div className="view-index-btns-container">
                        <button className={`view-index-btn${activeViewIndex === messages.length - 1 ? ' disabled' : ''}`} onClick={() => adjustViewIndex(1)}>↑</button>
                        <button className={`view-index-btn${activeViewIndex === 0 ? ' disabled' : ''}`} onClick={() => adjustViewIndex(-1)}>↓</button>
                    </div>
                </div>
            </div>
            <div className="log-filter-btns">
                {filterButtons}
            </div>
        </div>
    );
}

export default Log;