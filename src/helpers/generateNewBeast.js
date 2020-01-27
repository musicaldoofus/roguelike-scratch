import rollDie from './rollDie';
import beastDictionary from './beastDictionary';
import elements from './elements';

const generateNewBeast = (allowedBeasts = ['spider']) => {
  const lvl = 1; //depend on levels allowed for beast (abstract to a function or die roll)
  const lvlMod = lvl - 1; //only allow beasts to mod at >= lvl2
  const beastType = allowedBeasts[Math.floor(Math.random() * allowedBeasts.length)]
  const beastRef = Object.assign({}, beastDictionary[beastType]);
  const elementalScarcity = rollDie(beastRef.elementalScarcity) + lvlMod;
  const floorDCChecks = { //roll DC checks based on Location lvl; think "roll on table 'y' for 'x' LocationLvl"
    elements: rollDie('2d4+4')
  };
  beastRef.hp = rollDie(beastRef.healthDie);
  if (elementalScarcity > floorDCChecks.elements) beastRef.elem = 'fire';
  beastRef.hp +=  lvlMod + elements.hasOwnProperty(beastRef.elem) ? elements[beastRef.elem].healthMod : 0;
  return beastRef;
}

export default generateNewBeast;