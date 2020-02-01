import React, { useState, useMemo } from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import LogBody from '../../molecules/LogBody';
import LogScrollBtns from '../../molecules/LogScrollBtns';
import LogFilterBtns from '../../molecules/LogFilterBtns';
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
    const begIndex = endIndex >= VIEW_LIMIT ? endIndex - VIEW_LIMIT : 0;
    const logMessages = filteredMessages.slice(begIndex, endIndex);
        
    return (
        <div className="log">
            <div className="log-body">
                <LogBody
                    messages={logMessages}
                />
                <LogScrollBtns
                    messagesLength={filteredMessages.length}
                    handleAdjustViewIndex={adjustViewIndex}
                />
            </div>
            <LogFilterBtns
                ctxFocus={ctxFocus}
                handleFilterClick={handleFilterClick}
                displayTypes={displayTypes}
            />
        </div>
    );
}

export default Log;