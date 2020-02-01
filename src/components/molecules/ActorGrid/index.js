import React from 'react';
import BeastCell from '../../molecules/BeastCell';
import './ActorGrid.css';

const ActorGrid = ({gridStyle, nearbyBeasts, onClick}) => {
    return (
        <div className="room-grid actor-grid" style={gridStyle}>
            {nearbyBeasts.length > 0 && (
                nearbyBeasts.map(beast => {
                    const beastGridAreaStyle = {
                        gridColumn: `${beast.coords.x} / ${beast.coords.x + 1}`,
                        gridRow: `${beast.coords.y} / ${beast.coords.y + 1}`                
                    };
                    const dispatchParams = {
                        ctx: 'BeastCell',
                        type: 'handleTargetBeast',
                        beast
                    };
                    
                    return (
                        <BeastCell
                            key={''.concat(beast.coords.x).concat(beast.coords.y)}
                            onClick={() => onClick(dispatchParams)}
                            beast={beast}
                            gridAreaStyle={beastGridAreaStyle}
                        />
                    );
                })
            )}
        </div>
    );
}

export default ActorGrid;