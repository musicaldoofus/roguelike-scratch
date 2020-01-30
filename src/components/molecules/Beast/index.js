import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './Beast.css';

const BeastHealthBar = ({currHealth, maxHealth}) => {
  const width = `${currHealth / maxHealth * 100}%`;
  const barStyle = {
    width
  };
  return (
    <div className="health-bar">
      <span style={barStyle}></span>
    </div>
  )
}

const BeastBattleControls = () => {
  const [, dispatchGameState] = useGameState();
  
  const adjustHP = (amt = -1) => dispatchGameState({
    type: 'adjustHP',
    ctx: 'battlepod',
    targetActor: 'player',
    amt
  });
  return (
    <div className="beast-display-actions">
      <button onClick={() => adjustHP(-1)}>Attack</button>
    </div>
  );
}

export default BeastBattleControls;
export { BeastHealthBar };