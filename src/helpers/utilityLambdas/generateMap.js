const MAP_CONSTANTS = {
    MAP_DIMENSIONALITY: 80,
    ROOM_DIMENSIONALITY_MIN: 7,
    ROOM_DIMENSIONALITY_MAX: 25
};

const generateRoom = (coords, roomIndex, tunnelFromDir) => {
    //console.log('tunnelFromDir', tunnelFromDir);
    const getAvailWidth = () => MAP_CONSTANTS.MAP_DIMENSIONALITY - coords.x;
    const getAvailHeight = () => MAP_CONSTANTS.MAP_DIMENSIONALITY - coords.y;
    //console.log('getAvailWidth', getAvailWidth(), 'getAvailHeight', getAvailHeight())
    if (getAvailHeight() < MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN || getAvailWidth() < MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN) return null;
    
    const id = 0; //increment
    const type = 'none'; //develop - could be patterns of room tiles/different room building algorithm (none|swarm|pit|maze|shrine|...)
    const upperBound = MAP_CONSTANTS.ROOM_DIMENSIONALITY_MAX + 1;
    const delta = upperBound - MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN;
    const dimensionality = Math.floor(Math.random() * delta) + MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN;
    const isEdge = (i) => {
        if (i <= dimensionality) return 'top';
        else if (i % dimensionality === 0) return 'left';
        else if(i % dimensionality === (dimensionality - 1)) return 'right';
        else if (i >= (dimensionality ** 2) - dimensionality) return 'bottom';
        else return false;
    }

    const tunnelDirections = [
        //getAvailHeight() >= MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN ?
            'down'
            //: getAvailWidth() >= MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN ?
                //'right' : null
    ].filter(dir => dir !== null);

    //extend - depend on rules for portals (i.e. amt per wall and direction)
    const topPortalIndex = tunnelFromDir === 'down' ? Math.floor(Math.random() * (dimensionality - 4)) + 1 : null;
    const leftPortalIndex = tunnelFromDir === 'right' ? dimensionality * Math.floor(Math.random() * (dimensionality - 4) + 2) : null;
    const rightPortalIndex = tunnelDirections.indexOf('right') > - 1 ? (dimensionality * Math.floor(Math.random() * (dimensionality - 4) + 2)) - 1 : null;
    const bottomPortalIndex = tunnelDirections.indexOf('down') > - 1 ? (dimensionality ** 2) - Math.floor(Math.random() * dimensionality) : null;
    /*
    extend:
    portalIndex = {
        index: ${indexInList},
        toRoomIndex: ${roomIndexPointer}
    }
    */
    const indices = {
        top: topPortalIndex,
        left: leftPortalIndex,
        right: rightPortalIndex,
        bottom: bottomPortalIndex
    };
    const portalIndices = Object.fromEntries(Object.keys(indices).filter(k => indices[k] !== null).map(k => [k, indices[k]]));

    const tiles = Array.from({length: dimensionality ** 2}, (_, i) => { //simple static version - returns array of singletons (AKA room with walls on outside and empty tiles within)
        const edge = isEdge(i);
        const isPortal = portalIndices[edge] === i;
        //console.log(`test ${i}: ${isPortal}; ${edge}`)
        const tileType = isPortal ? 'portal': !edge ? 'none' : 'wall';
        //console.log(`Got tile at index ${i}: isPortal === ${isPortal}; tileType === ${tileType}; edge === ${edge}`);
        if (isPortal) return {
            tileType,
            toRoomIndex: roomIndex + (edge === 'bottom' || edge === 'right' ? 1 : -1) //improve - 'find' target index independent of order in list
        };
        return {
            tileType
        };
    });

    return {
        id,
        type,
        dimensionality,
        tiles,
        tunnelDirections,
        portalIndices
    };
}

const generateMap = () => {
    const initCoords = {
        x: 4,
        y: 4
    };

    const generateRooms = (coords, roomIndex, tunnelFromDir) => {
        /*
        update:
        - invoke with xCoord only, not yCoord
        - first yCoord is randomly determined
        - determine yCoord within generateRoom() for next room:
        -- Range for yCoord for next room must:
        --- lowerYCoord = [(previousRoomUpperYCoord === 0 ? 0 : ) - (previousRoomUpperYCoord - 2)] //allow space for a portal tile + wall tile
        --- upperYCoord = [(previousRoomUpperYCoord > 0 ? lowerYCoord + MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN, ]
        */
        const room = generateRoom(coords, roomIndex, tunnelFromDir);
        if (!room) return;
        else {
            const dir = room.tunnelDirections[Math.floor(Math.random() * room.tunnelDirections.length)]; //improve
            //if (!dir || room.tunnelDirections.length === 0) throw new Error(`dir and room.tunnelDirections must have valid values: ${JSON.stringify(dir)} ${JSON.stringify(room.tunnelDirections)}`);
            const nextCoords = {
                x: dir === 'right' ? coords.x + room.dimensionality : coords.x,
                y: dir === 'down' ? coords.y + room.dimensionality : coords.y
            };
            //console.log(`Going ${dir} at ${JSON.stringify(nextCoords)} for i ${roomIndex}`);
            return [].concat(room).concat(generateRooms(nextCoords, roomIndex + 1, dir)).filter(r => r !== undefined);
        }
    }

    return generateRooms(initCoords, 0);
}

export default generateMap;
export { generateRoom };