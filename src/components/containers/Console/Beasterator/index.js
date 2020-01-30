import React, { Fragment, useState } from 'react';
import generateNewBeast from '../../../../helpers/utilityLambdas/generateNewBeast';
import beastDictionary from '../../../../helpers/dictionaries/beastDictionary';
import { useGameState } from '../../../../helpers/reducers/gameStateReducer';
import './Beasterator.css';

const Beasterator = () => {
  const [, dispatchGameState] = useGameState();
  const [beast, setBeast] = useState(null);
  const [selectedBeastList, setBeastList] = useState([]);
  const ctx = 'console';

  const getNewBeast = () => generateNewBeast(selectedBeastList.length > 0 ? selectedBeastList : Object.keys(beastDictionary))

  const handleClickNewBeast = () => {
    const newBeast = getNewBeast();
    dispatchGameState({
      ctx,
      type: 'addLog',
      value: `Generated a new ${newBeast.baseTitle}`
    });
    setBeast(newBeast);
  }

  const handleToggleCheckbox = (b) => {
    const concat = selectedBeastList.indexOf(b) === -1;
    const updatedList = concat ? selectedBeastList.concat(b) : selectedBeastList.filter(s => s !== b);
    setBeastList(updatedList);
  }

  const handlePushBeast = () => {
    const newBeast = beast ? beast : getNewBeast();
    dispatchGameState({
      ctx,
      type: 'pushBeastToRoom',
      beast: newBeast,
      roomIndex: 0
    });
    setBeast(null);
  }

  const beastCheckboxes = Object.keys(beastDictionary).map(b => (
    <Fragment key={b}>
      <label>{b}</label>
      <input
        type="checkbox"
        value={selectedBeastList.indexOf() > -1}
        onClick={() => handleToggleCheckbox(b)}
      />
    </Fragment>
  ));

  return (
    <div className="beasterator">
      <div className="console-component-title">
        <h3>Beasterator</h3>
      </div>
      <div className="beasterator-controls">
        {beastCheckboxes}
      </div>
      <div className="btn">
        <button onClick={handleClickNewBeast}>Generate new beast</button>
        <button onClick={handlePushBeast}>Generate + push to Room</button>
      </div>
      <div className="beast-container">
        {beast &&
          <>
            <button onClick={() => handlePushBeast(beast)}>Push to Room</button>
          </>
        }
      </div>
    </div>
  );
}

export default Beasterator;