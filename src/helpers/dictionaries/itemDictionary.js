const canDrop = {
    type: 'drop',
    doesRemove: true
};

const canThrow = {
    type: 'throw',
    doesRemove: true
};

const itemDictionary = {
    weapon: {
        allowedActions: [
            {
                type: 'attack',
                doesRemove: false
            },
            {...canThrow},
            {...canDrop}
        ]
    },
    potion: {
        allowedActions: [
            {
                type: 'quaff',
                doesRemove: true
            },
            {...canDrop}
        ]
    }
};

export default itemDictionary;