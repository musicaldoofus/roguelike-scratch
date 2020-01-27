const beastDictionary = {
  spider: {
    baseTitle: 'Cave Spider',
    scarcity: '1d4-1', //each time a room is generated, an amount of this beast is rolled for; higher rolls indicate higher frequency etc.
    healthDie: '1d3+1',
    armorDie: 0,
    savingThrowDie: '1d6',
    strength: '1d4',
    elementalScarcity: '2d6',
    imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Araneus_diadematus_%28Spider_underside%29.jpg'
  },
  rat: {
    baseTitle: 'Cave Rat',
    scarcity: '1d4-2',
    healthDie: '1d2+1',
    armorDie: 0,
    savingThrowDie: 0,
    strength: 2,
    elementalScarcity: '3d6',
    imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Albino_Rat.jpg'
  }
}

export default beastDictionary;