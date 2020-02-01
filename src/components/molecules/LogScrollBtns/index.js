import React from 'react'

const LogScrollBtns = ({messagesLength, activeViewIndex, handleAdjustViewIndex}) => {
    return (
        <div className="log-body-view-index-btns">
            <div className="view-index-btns-container">
                <button className={`view-index-btn${(messagesLength === 0 || activeViewIndex === messagesLength - 1) ? ' disabled' : ''}`} onClick={() => handleAdjustViewIndex(1)}>↑</button>
                <button className={`view-index-btn${activeViewIndex === 0 ? ' disabled' : ''}`} onClick={() => handleAdjustViewIndex(-1)}>↓</button>
            </div>
        </div>
    );
}

export default LogScrollBtns;