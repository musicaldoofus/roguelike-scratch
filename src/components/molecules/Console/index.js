import React, { useState } from 'react';
import PrintBtn from '../PrintBtn';
import Beasterator from '../../Game/Beasterator'
import Roller from '../../Game/Roller';
import Locationator from '../../Game/Locationator';
import './Console.css';

const Console = () => {
    const [isCollapsed, setCollapsed] = useState(true);
    
    const handleToggleCollapse = () => setCollapsed(!isCollapsed);
    return (
        <div className={`console${isCollapsed ? ' collapsed' : ''}`}>
            {!isCollapsed &&
                <div className="console-body">
                    <PrintBtn/>
                    <Beasterator/>
                    <Roller/>
                    <Locationator/>
                </div>
            }
            <div className="console-collapse-btn">
                <button onClick={handleToggleCollapse}>{isCollapsed ? 'Expand \u2193' : 'Collapse \u2191'}</button>
            </div>
        </div>
    )
}

export default Console;