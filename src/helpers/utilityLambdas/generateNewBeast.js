import rollDie from './rollDie';
import beastDictionary from '../dictionaries/beastDictionary';
import elements from '../initModels/elements';

const getKey = () => Math.random() * 100;

const generateNewBeast = (allowedBeasts = ['spider'], locationLvl = 1) => {
  const floorDCChecks = { //roll DC checks based on Location lvl; think "roll on table 'y' for 'x' LocationLvl"
    elements: rollDie('2d4+4')
  };
  const lvlMod = locationLvl - 1; //only allow beasts to mod at >= lvl2

  const beastBaseTitle = allowedBeasts[Math.floor(Math.random() * allowedBeasts.length)];
  const beastRef = beastDictionary[beastBaseTitle];
  const key = getKey();
  const hp = rollDie(beastRef.healthDie) + lvlMod;
  const maxHp = hp;
  const elem = rollDie(beastRef.elementalScarcity) + lvlMod > floorDCChecks.elements ? elements[Math.floor(Math.random() * elements.length)] : null;

  const generatedParams = {
    hp,
    maxHp,
    key,
    elem
  }
  
  return Object.assign({}, beastRef, generatedParams);
}

export default generateNewBeast;