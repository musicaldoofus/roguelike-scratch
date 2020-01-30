const samplePlayerStats = {
    levelCoords: {
        roomId: 0 //
    },
    roomCoords: {
        x: 1,
        y: 2
    },
    inventory: [{
        type: 'weapon',
        label: 'Spear',
        damage: '1d4',
        proximity: [
            'melee',
            'ranged'
        ],
        equippedBy: 'hand',
        range: '30ft',
        rangeMod: '1d4',
        description: 'Old and scraggly, you picked this up from your dead father\'s corpse. He didn\'t seem to mind.'
    },
    {
        type: 'potion',
        label: 'Absolve Corruption I',
        proximity: 'ranged',
        rangeMod: '1d4',
        equippedBy: 'hand',
        description: 'Smells a bit like old cheese mixed with your gym socks.'
    }],
    baseStats: {
        strength: 1,
        agility: 1,
        constitution: 1,
        perception: 1,
        wisdom: 1,
        intelligence: 1,
        savingThrow: '1d8'
    },
    vitalStats: {
        hp: 10,
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