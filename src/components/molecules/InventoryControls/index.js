import React, { useState } from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import itemDictionary from '../../../helpers/dictionaries/itemDictionary';
import './InventoryControls.css';

const InventoryControls = () => {
    const [gameState, dispatchGameState] = useGameState();
    const [focusItem, setFocusItem] = useState();

    const handleUseItem = (itmAction) => dispatchGameState({
        ctx: 'inventory',
        type: 'applyAction',
        item: focusItem,
        itmAction
    });

    const inventory = gameState.player.inventory.map((item, i) => (
        <div key={item.baseTitle.concat(i)} className="inventory-item" onClick={() => setFocusItem(item)}>
            {item.baseTitle}
        </div>
    ));
    const isInIventory = focusItem && focusItem.hasOwnProperty('key') && gameState.player.inventory.filter(item => item.key === focusItem.key).length > 0;
    
    return (
        <div className="inventory-controls">
            {inventory}
            {isInIventory && (
                <div className="focus-item-container">
                    <h5>Use {focusItem.baseTitle}</h5>
                    <div className="focus-item-action-list">
                        {itemDictionary[focusItem.type].allowedActions.map(a => (
                            <button key={a.type} onClick={() => handleUseItem(a)}>{a.type}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default InventoryControls;