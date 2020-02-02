const samplePlayerStats = {
    roomCoords: {
        x: 1,
        y: 2,
        roomIndex: 0
    },
    inventory: [{
        type: 'weapon',
        baseTitle: 'Spear',
        isEquipped: true,
        damage: '1d4',
        key: 1001, //arbitrary - improve
        proximity: [
            'melee',
            'ranged'
        ],
        equippedBy: 'hand',
        range: '20ft',
        rangeMod: '1d4',
        description: 'Old and scraggly, you picked this up from your dead father\'s corpse. He didn\'t seem to mind.'
    },
    {
        type: 'potion',
        key: 1002, //arbitrary - improve
        baseTitle: 'Absolve Corruption I',
        proximity: 'ranged',
        rangeMod: '1d4',
        equippedBy: 'hand',
        description: 'Smells a bit like old cheese mixed with your gym socks.'
    }],
    baseStats: {
        //modify only with atypical events
        strength: 1,
        agility: 1,
        constitution: 1,
        perception: 1,
        wisdom: 1,
        intelligence: 1,
        savingThrow: '1d8'
    },
    vitalStats: {
        //modify with typical events
        hp: 10,
        sp: 0,
        xp: 0
    },
    corruption: [
        {
            type: '',
            description: '',
            statMod: 'perception',
            mod: -1
        }
    ]
};

export default samplePlayerStats;