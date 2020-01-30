import React, { useState } from 'react';
import rollDie from '../../../helpers/rollDie';
import standardDice from '../../../helpers/standardDice';
import { useGameState } from '../../../helpers/reducers/gameStateReducer';

const Roller = () => {
  const [, dispatchGameState] = useGameState();
  const [dieAmt, setDieAmt] = useState(1);
  const [die, setDie] = useState('d4');
  const [mod, setMod] = useState(0);
  const [rollVal, setRollVal] = useState(0);

  const handleModifierOnChange = ({target}) => setMod(target.value);

  const handleDieNumberOnChange = ({target}) => setDieAmt(target.value);

  const handleDieSelect = (d) => setDie(d);

  const handleRoll = () => {
    const rollResult = rollDie(rollString);
    dispatchGameState({
      ctx: 'roller',
      type: 'addLog',
      value: `Rolling ${rollString}... Result: ${rollResult}`
    });
    setRollVal(rollResult);
  }

  const diceBtns = standardDice.map(d => {
    const btnDie = `d${d}`;
    return (
      <button
        key={d}
        onClick={() => handleDieSelect(btnDie)}
        className={`btn${btnDie === die ? ' active' : ''}`}
      >
        {btnDie}
      </button>
    );
  });

  const rollString = `${dieAmt}${die}${mod > 0 ? `+${mod}` : ''}`;

  return (
    <div className="roller">
      <div className="console-component-title">
        <h3>Roller</h3>
      </div>
      <div className="button-die-number">
        <input onChange={handleDieNumberOnChange} value={dieAmt}/>
      </div>
      <div className="button-group-dice">
        {diceBtns}
      </div>
      <div className="modifiers">
        Set modifier
        <input type="number" onChange={handleModifierOnChange} value={mod}/>
      </div>
      <button onClick={handleRoll} msg={`[Roller]: Rolled ${rollString}`}>Roll die</button>
      {rollVal && (
        <div className="roll-value">
          Rolling {rollString}... {rollVal}
        </div>
      )}
    </div>
  );
}

export default Roller;