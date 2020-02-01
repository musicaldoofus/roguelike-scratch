import React from 'react';

const LogFilterBtns = ({ctxFocus, displayTypes, handleFilterClick}) => {
    const filterButtons = displayTypes.map(t => (
        <button className={`filter-btn${ctxFocus === t ? ' active' : ''}`} key={t} onClick={() => handleFilterClick(t)}>
            <span>{t}</span>
        </button>
    ));
    return (
        <div className="log-filter-btns">
            {filterButtons}
        </div>
    );
}

export default LogFilterBtns;