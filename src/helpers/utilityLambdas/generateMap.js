const CONSTANTS = {
    MAP_DIMENSIONALITY: 80,
    ROOM_DIMENSIONALITY_MIN: 25,
    ROOM_DIMENSIONALITY_MAX: 25
};

const generateRoom = (coords) => {
    const getAvailWidth = () => CONSTANTS.MAP_DIMENSIONALITY - coords.x;
    const getAvailHeight = () => CONSTANTS.MAP_DIMENSIONALITY - coords.y;
    if (getAvailHeight() < CONSTANTS.ROOM_DIMENSIONALITY_MIN || getAvailWidth() < CONSTANTS.ROOM_DIMENSIONALITY_MIN) return null;
    
    const id = 0; //increment
    const type = 'none'; //develop - could be patterns of room tiles/different room building algorithm (none|swarm|pit|maze|shrine|...)
    const dimensionality = Math.floor(Math.random() * (CONSTANTS.ROOM_DIMENSIONALITY_MAX + 1 - CONSTANTS.ROOM_DIMENSIONALITY_MIN) + CONSTANTS.ROOM_DIMENSIONALITY_MIN);
    
    const isEdge = (i) => i <= dimensionality || i % dimensionality === 0 || i % dimensionality === (dimensionality - 1) || i >= (dimensionality ** 2) - dimensionality;

    const tiles = Array.from({length: dimensionality ** 2}, (_, i) => { //simple static version - returns array of singletons (AKA room with walls on outside and empty tiles within)
        const tileType = isEdge(i) ? 'wall' : 'none';
        
        return {
            tileType
        };
    });

    const tunnelDirections = [
        getAvailHeight() >= CONSTANTS.ROOM_DIMENSIONALITY_MIN ? 'down' : null,
        getAvailWidth() >= CONSTANTS.ROOM_DIMENSIONALITY_MIN ? 'right' : null
    ].filter(dir => dir !== null);

    return {
        id,
        type,
        dimensionality,
        tiles,
        tunnelDirections
    };
}

const generateMap = () => {
    const initCoords = {
        x: 0,
        y: 0
    };

    const generateRooms = (coords) => {
        const room = generateRoom(coords);
        if (!room) return;
        else {
            const dir = room.tunnelDirections[Math.floor(Math.random() * room.tunnelDirections.length)]; //improve
            if (!dir || room.tunnelDirections.length === 0) throw new Error(`dir and room.tunnelDirections must have valid values: ${JSON.stringify(dir)} ${JSON.stringify(room.tunnelDirections)}`);
            const nextCoords = {
                x: dir === 'right' ? coords.x + room.dimensionality : coords.x,
                y: dir === 'down' ? coords.y + room.dimensionality : coords.y
            };
            return [].concat(room).concat(generateRooms(nextCoords)).filter(r => r !== undefined);
        }
    }

    return generateRooms(initCoords);
}

export default generateMap;
export { generateRoom };