import React from 'react';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';
import './Beast.css';

const BeastAvatar = ({imgSrc, baseTitle}) => {
  return (
    <div className="beast-display-avatar display-img">
      <img src={imgSrc} alt={baseTitle} title={baseTitle}/>
    </div>
  );
}

const BeastBattleStats = () => {
  const [gameState] = useGameState();

  const keysToInclude = /(strength|hp)/gi;
  const stats = gameState.location.nearbyBeasts.filter(b => b.isInBattle)[0];
  if (!stats) throw new Error(`Must include a valid beast reference in gameState.location for beasts ${JSON.stringify(gameState.location.nearbyBeasts)}`)
  return (
    <div className="beast-display-stats">
      <div>
        stats.isInBattle: {''.concat(stats.isInBattle)}
      </div>
      {Object.keys(stats).filter(k => keysToInclude.test(k)).map(k => (
        <div key={k}>
          <span>
            {k}: {stats[k]}
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
  const {imgSrc, baseTitle} = beast;
  return (
    <div className="display-beast">
      <BeastAvatar imgSrc={imgSrc} baseTitle={baseTitle}/>
    </div>
  );
}

const BattleBeast = () => {
  return (
    <div className="beast-display">
      <BeastAvatar/>
      <BeastBattleStats/>
      <BeastBattleControls/>
    </div>
  );
}

export default BattleBeast;
export { DisplayBeast };