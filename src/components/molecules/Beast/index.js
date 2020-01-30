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

const BeastAvatar = ({imgSrc, baseTitle}) => {
  return (
    <div className="beast-display-avatar display-img">
      <img src={imgSrc} alt={baseTitle} title={baseTitle}/>
    </div>
  );
}

const BeastBattleStats = (beast) => {
  const keysToInclude = /(strength|hp)/gi;
  return (
    <div className="beast-display-stats">
      <div>
        isInBattle: {''.concat(beast.isInBattle)}
      </div>
      {Object.keys(beast).filter(k => keysToInclude.test(k)).map(k => (
        <div key={k}>
          <span>
            {k}: {beast[k]}
          </span>
        </div>)
      )}
    </div>
  );
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

const DisplayBeast = ({beast}) => {
  const [, dispatchGameState] = useGameState();

  const {imgSrc, baseTitle} = beast;

  const handleTargetBeast = () => dispatchGameState({
    ctx: 'room',
    type: 'handleTargetBeast',
    beast
  });

  return (
    <div className="display-beast">
      <BeastAvatar imgSrc={imgSrc} baseTitle={baseTitle}/>
      <div>
        <button onClick={handleTargetBeast}>Select</button>
      </div>
    </div>
  );
}

const Beast = (beast) => {
  return (
    <div className="battle-beast">
      <BeastAvatar {...beast}/>
      <BeastBattleStats {...beast}/>
      <BeastBattleControls/>
    </div>
  );
}

export default Beast;
export { DisplayBeast, BeastHealthBar };