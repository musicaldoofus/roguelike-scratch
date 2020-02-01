import React from 'react';
import BeastHealthBar from '../BeastHealthBar';

const BeastCell = ({beast, gridAreaStyle, onClick}) => {
    return (
        <div onClick={onClick} className={`beast ${beast.baseTitle.replace(/\s/g, '-').toLowerCase()}${beast.isTargeted ? ' is-targeted' : ''}`} style={gridAreaStyle}>
            <BeastHealthBar currHealth={beast.hp} maxHealth={beast.maxHp}/>
        </div>
    );
}

export default BeastCell;