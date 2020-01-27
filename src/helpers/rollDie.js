const rollDie = (die) => {
  //extend to allow multiple dice to be rolled
  if (die === 0) return 0;
  const hazMod = die.indexOf('+') > -1;
  const n = Number(die.split('')[0]);
  const d = Number(hazMod ? die.split('d')[1].split('+')[0] : die.split('d')[1]);
  const mod = hazMod ? Number(die.split('+')[1]) : 0;
  const getRoll = () => Math.ceil(Math.random() * d);
  const reducedVal = Array.from({length: n}, _ => getRoll())
    .reduce((acc, curr) => acc + curr)
    + mod;
  return reducedVal > 0 ? reducedVal : 0;
}

export default rollDie;