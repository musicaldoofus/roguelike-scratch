import React, { useState, useMemo } from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import Loading from '../../atoms/Loading';
import './Log.css';

const Log = () => {
    const [gameState] = useGameState();
    const [ctxFocus, setCtxFocus] = useState('general');
    const [activeViewIndex, setActiveViewIndex] = useState(0);
    
    const displayTypes = useMemo(() => {
        return gameState.log.messages
            .map(({ctx}) => ctx)
            .reduce((acc, curr) => {
                if (acc.indexOf(curr) > -1) return acc;
                else return acc.concat(',').concat(curr);
            })
            .split(',');
        }, [gameState.log.messages]);

    const handleFilterClick = (t) => {
        setActiveViewIndex(0);
        setCtxFocus(t);
    }

    const messages = gameState.log.messages;
    const filteredMessages = ctxFocus === 'general' ? messages : messages.filter(({ctx}) => ctx === ctxFocus);
    const VIEW_LIMIT = 11; //arbitrary - draw by element.getClientBoundingRect()

    const adjustViewIndex = (amt) => {
        if (activeViewIndex + amt < 0 || activeViewIndex + amt > filteredMessages.length - 1) return;
        setActiveViewIndex(amt ? activeViewIndex + amt : 0);
    }
    
    const endIndex = filteredMessages.length - activeViewIndex;
    const begIndex = endIndex >= VIEW_LIMIT ?
        endIndex - VIEW_LIMIT
        : 0;
    const logMessages = filteredMessages
        .slice(begIndex, endIndex)
        .map((m, i) => (
            <div key={m.value.concat(i)}>
                <span>{m.value}</span>
            </div>
        ));
    const filterButtons = displayTypes ? displayTypes.map(t => (
        <button className={`filter-btn${ctxFocus === t ? ' active' : ''}`} key={t} onClick={() => handleFilterClick(t)}>
            <span>{t}</span>
        </button>
    )) : (
        <Loading/>
    );

    return (
        <div className="log">
            <div className="log-body">
                <div className="log-body-inner-container">
                    {logMessages}
                </div>
                <div className="log-body-view-index-btns">
                    <div className="view-index-btns-container">
                        <button className={`view-index-btn${(filteredMessages.length === 0 || activeViewIndex === filteredMessages.length - 1) ? ' disabled' : ''}`} onClick={() => adjustViewIndex(1)}>↑</button>
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