const initRoom = [{ //array of room objects, generated each level change
    id: 0,
    type: 'none',
    dimensionality: 12, //square configuration for all rooms
    tiles: [{
        type: 'wall'
    }, {
        type: 'portal'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    },
    
    //2nd row
    {
        type: 'wall'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'wall'
    },
    
    //3rd row
    {
        type: 'wall'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'wall'
    },
    
    //4th row
    {
        type: 'wall'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'wall'
    },
    
    //5th row
    {
        type: 'wall'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'wall'
    },
    
    //6th row
    {
        type: 'wall'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'wall'
    },
    
    //7th row
    {
        type: 'wall'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'wall'
    },
    
    //8th row
    {
        type: 'wall'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'wall'
    },
    
    //9th row
    {
        type: 'wall'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'wall'
    },
    
    //10th row
    {
        type: 'wall'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'wall'
    },
    
    //11th row
    {
        type: 'wall'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'none'
    }, {
        type: 'wall'
    },
    
    //12th row
    {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }, {
        type: 'wall'
    }],
    carvingRules: [{
        type: 'portal', //(portal|tunnel|wall)
        wall: 'top', //box model terms (top|right|bottom|left)
        hasDoor: false,
        isDoorLocked: false, //default - determined randomly for early levels and by rules for higher levels; irrelevant for !hasDoor
        wallAxisCoord: 1
    }, {
        type: 'portal',
        wall: 'right',
        hasDoor: false,
        wallAxisCoord: 4 //range determined by gameState.location.map[thisRoomIndex].size
    }, {
        type: 'tunnel',
        tunnelType: 'open', //(open|direct|...)
        canFork: true //default - irrelevant for tunnelType === 'open'
    }, {
        type: 'wall',
        wallType: 'none'
    }],
    beastGenerationRules: [{
        type: 'none' //(none|nest|...)
    }],
    isSeen: true
}];

export default initRoom;