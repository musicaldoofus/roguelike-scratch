import toCoords, { toIndex } from '../utilityLambdas/toCoords';

const MAP_CONSTANTS = {
    MAP_DIMENSIONALITY: 100,
    MAP_VISIBLE_DIMENSIONALITY_MAX: 30,
    ROOM_DIMENSIONALITY_MIN: 6,
    ROOM_DIMENSIONALITY_MAX: 30,
    ROOM_LEVEL_PORTAL_MAX: 1,
    SHOP_DIMENSIONALITY_MAX: 20,
    SHOP_DIMENSIONALITY_MIN: 8,
    BUILDING_DIMENSIONALITY_HEIGHT: 3,
    BUILDING_DIMENSIONALITY_WIDTH: 5
};

const isEdge = (i, dimensionality) => {
    if (i <= dimensionality) return 'top';
    else if (i % dimensionality === 0) return 'left';
    else if(i % dimensionality === (dimensionality - 1)) return 'right';
    else if (i >= (dimensionality ** 2) - dimensionality) return 'bottom';
    else return false;
}

const generateRoom = ({coords, roomIndex, tunnelFromDir, type, edges, structsInRoom, dimensionality, portalIndices}) => {
    if (type === 'building') {
        //dependencies: [dimensionality, portalIndices, roomIndex]
        const tiles = Array.from({length: dimensionality ** 2}, (_, i) => {
            if (isEdge(i, dimensionality)) {
                if (Object.keys(portalIndices).filter(k => portalIndices[k] === i).length > 0) return {
                    tileType: 'portal',
                    toRoomIndex: roomIndex + 1 //improve - currently has to be before room that it's within; this doesn't allow multiple structures
                };

                return {
                    tileType: 'wall'
                };
            }
            
            return {
                tileType: 'none'
            };
        });
        return {
            coords,
            id: roomIndex,
            type,
            dimensionality,
            tiles,
            portalIndices //consider adding mapCoords
        }
    }

    //dependencies: [dimensionality, MAP_CONSTANTS, structsInRoom, edges, roomIndex]
    if (type === 'open') {
        const roomDimensionality = dimensionality ? dimensionality : MAP_CONSTANTS.MAP_VISIBLE_DIMENSIONALITY_MAX;
        const openBldgCoords = [{ //extend - calculate based on available space
            x: 12,
            y: 20
        }];
        
        const bldgIndices = !structsInRoom ? []
            : (() => {
                const randBldgCoord = structsInRoom[0].coords ? structsInRoom[0].coords : openBldgCoords[Math.floor(Math.random() * openBldgCoords.length)];
                const bldgX = randBldgCoord.x;
                const bldgY = randBldgCoord.y;
                
                return Array.from({length: MAP_CONSTANTS.BUILDING_DIMENSIONALITY_HEIGHT}, (_, hInd) => {
                    return Array.from({length: MAP_CONSTANTS.BUILDING_DIMENSIONALITY_WIDTH}, (_, wInd) => {
                        return toIndex({x: bldgX + wInd, y: bldgY + hInd}, roomDimensionality);
                    })
                }).flat();
            })();

        //dependencies: [roomDimensionality, structsInRoom <= bldgIndices, edges, roomIndex]
        const tiles = Array.from({length: roomDimensionality ** 2}, (_, i) => {
            if (bldgIndices.indexOf(i) > -1) {
                if (structsInRoom && i === bldgIndices[structsInRoom[0].portalIndex]) {
                    return {
                        tileType: 'bldgPortal',
                        toRoomIndex: structsInRoom[0].roomIndex,
                    };
                }
                
                return {
                    tileType: 'building'
                };
            }
            const edge = isEdge(i, roomDimensionality);
            if (edge) {
                if (edges && (
                    (edge === 'top' && edges.top === 'open') ||
                    (edge === 'right' && edges.right === 'open') ||
                    (edge === 'bottom' && edges.bottom === 'open') ||
                    (edge === 'left' && edges.left === 'open')
                )) return {
                    tileType: 'openPortal',
                    toRoomIndex: roomIndex + (edge === 'top' || edge === 'left' ? -1 : 1)
                }
                return {
                    tileType: 'forest'
                };
            }
            return {
                tileType: 'none'
            };
        });

        const roomPortalIndices = portalIndices ? portalIndices : {
            right: Array.from({length: roomDimensionality}, (_, i) => (i + 1) * roomDimensionality - 1).filter(i => i !== roomDimensionality - 1 && i !== roomDimensionality ** 2 - 1) //extend - static, only targets right side open
        }

        return {
            coords,
            id: roomIndex,
            edges,
            type,
            dimensionality: roomDimensionality,
            tiles,
            portalIndices: roomPortalIndices, //consider adding mapCoords
            structsInRoom
        };
    }

    const getAvailWidth = () => MAP_CONSTANTS.MAP_DIMENSIONALITY - coords.x;
    const getAvailHeight = () => MAP_CONSTANTS.MAP_DIMENSIONALITY - coords.y;
    if (getAvailHeight() < MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN || getAvailWidth() < MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN) return null;
    
    const id = roomIndex; //improve - increment & use toRoomId(room.id) instead of toRoomIndex(roomIndex)
    const upperBound = MAP_CONSTANTS.ROOM_DIMENSIONALITY_MAX + 1;
    const delta = upperBound - MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN;
    const largestDimensionality = Math.floor(Math.random() * delta) + MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN;
    const roomDimensionality = Math.min(largestDimensionality, getAvailHeight(), getAvailWidth());
    const tunnelDirections = [
        getAvailHeight() >= MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN ? 'bottom' : null,
        getAvailWidth() >= MAP_CONSTANTS.ROOM_DIMENSIONALITY_MIN ? 'right' : null
    ].filter(dir => dir !== null);

    const topPortalIndex = tunnelFromDir === 'bottom' ? Math.floor(Math.random() * (roomDimensionality - 4)) + 1 : null;
    const leftPortalIndex = tunnelFromDir === 'right' ? roomDimensionality * Math.floor(Math.random() * (roomDimensionality - 4) + 2) : null;
    const rightPortalIndex = tunnelDirections.indexOf('right') > - 1 ? (roomDimensionality * Math.floor(Math.random() * (roomDimensionality - 4) + 2)) - 1 : null;
    const bottomPortalIndex = tunnelDirections.indexOf('bottom') > - 1 ? (roomDimensionality ** 2) - Math.floor(Math.random() * (roomDimensionality - 4) + 2) : null;
    const tunnelDirection = Math.floor(Math.random() * 2) === 0 ? 'right' : 'bottom';
    const indices = {
        top: topPortalIndex,
        left: leftPortalIndex,
        right: tunnelDirection === 'right' ? rightPortalIndex : null,
        bottom: tunnelDirection === 'bottom' ? bottomPortalIndex : null
    };
    const roomPortalIndices = Object.fromEntries(Object.keys(indices).filter(k => indices[k] !== null).map(k => [k, indices[k]]));

    const tiles = Array.from({length: roomDimensionality ** 2}, (_, i) => {
        const edge = isEdge(i, roomDimensionality);
        const isAcceptableTunnelDirection = edge === tunnelDirection || edge === 'left' || edge === 'top';
        const isPortal = roomPortalIndices[edge] === i && isAcceptableTunnelDirection;
        const tileType = isPortal ? 'portal': !edge ? 'none' : 'wall';
        if (isPortal) return {
            tileType,
            toRoomIndex: roomIndex + (edge === 'bottom' || edge === 'right' ? 1 : -1) //improve - 'find' target index independent of order in list
        };
        return {
            tileType
        };
    });

    return {
        coords,
        id,
        type: type ? type : 'none',
        dimensionality: roomDimensionality,
        tiles,
        tunnelDirections,
        tunnelDirection,
        portalIndices: roomPortalIndices //consider adding mapCoords
    };
}

const generateMap = (level, roomsConfig) => {
    const initCoords = {
        x: 4,
        y: 4
    };
    const generateRooms = ({coords, roomIndex, tunnelFromDir}) => {
        const room = generateRoom({coords, roomIndex, tunnelFromDir});
        if (!room) return undefined;
        else {
            //const dir = room.tunnelDirections[Math.floor(Math.random() * room.tunnelDirections.length)];
            const nextCoords = {
                x: room.tunnelDirection === 'right' ? coords.x + room.dimensionality : coords.x,
                y: room.tunnelDirection === 'bottom' ? coords.y + room.dimensionality : coords.y
            };
            //console.log('prev coords, dir, dimensionality, new coords', coords, room.tunnelDirection, room.dimensionality, nextCoords);
            return [].concat(room)
                .concat(generateRooms({coords: nextCoords, roomIndex: roomIndex + 1, tunnelFromDir: room.tunnelDirection}))
                .filter(r => r !== undefined);
        }
    }

    const rooms = roomsConfig
        ? roomsConfig.map(r => generateRoom(r))
        : generateRooms({coords: initCoords, roomIndex: 0})

    const roomsWithLevelPortal = [ //can be same room
        Math.floor(Math.random() * rooms.length), //up level portal
        Math.floor(Math.random() * rooms.length) //down level portal
    ];

    console.log('roomsWithLevelPortal', roomsWithLevelPortal);

    const toLinkedRooms = (room, rInd) => {
        const levelPortalIndex = roomsWithLevelPortal.indexOf(rInd) > -1 ? (() => {
            console.log('roomInd', rInd, 'to add portal')
            const openSpaces = room.tiles
                .map(({tileType}, i) => ({tileType, i}))
                .filter(t => t.tileType === 'none')
                .map(({i}) => i);
                console.log('open', openSpaces);
            return Math.floor(Math.random() * openSpaces.length);
        })()
        : null;

        console.log('levelPortalIndex', rInd, levelPortalIndex, roomsWithLevelPortal)

        return Object.assign({}, room, {
            tiles: room.tiles.map((tile, i) => {
                if (i === levelPortalIndex) {
                    const levelDirection = roomsWithLevelPortal.indexOf(i) === 0 ? -1 : 1;
                    console.log('levelDirection', levelDirection);
                    return {
                        tileType: 'levelPortal',
                        toLevelIndex: level + levelDirection
                    }
                }

                if ((tile.tileType === 'portal' || tile.tileType === 'openPortal' || tile.tileType === 'bldgPortal') && !tile.hasOwnProperty('toRoomCoords')) {
                    const fromEdge = Object.keys(room.portalIndices).filter(edge => room.portalIndices[edge] === i)[0];
                    const oppositeSide = fromEdge === 'right' ? 'left' : fromEdge === 'left' ? 'right' : fromEdge === 'top' ? 'bottom' : 'top';
                    const targetRoom = rooms[tile.toRoomIndex];
                    
                    if (!targetRoom) {
                        return {
                            tileType: 'wall'
                        };
                    }

                    const targetPortalIndex = targetRoom.type === 'open' && tile.tileType !== 'openPortal' ?
                        toIndex(targetRoom.structsInRoom[0].coords, targetRoom.dimensionality) + targetRoom.structsInRoom[0].portalIndex
                        : targetRoom.type === 'building' ?
                            targetRoom.portalIndices[Object.keys(targetRoom.portalIndices)[0]]
                            : targetRoom.portalIndices[oppositeSide];

                    //console.log('targetPortalIndex', targetRoom, tile.toRoomIndex, oppositeSide, fromEdge, targetPortalIndex, tile.tileType);
                    
                    const { x, y } = tile.tileType === 'openPortal' ? 
                        {
                            x: targetRoom.edges && targetRoom.edges.left === 'open' ? 1 : targetRoom.dimensionality - 2,
                            y: toCoords(i, targetRoom.dimensionality).y
                        }
                        : toCoords(targetPortalIndex, targetRoom.dimensionality);
                    
                    return Object.assign({}, tile, {
                        toRoomCoords: {
                            x,
                            y
                        }
                    });
                }

                return tile;
            })
        });
    }

    return rooms.map(toLinkedRooms);
}

export default generateMap;
export { generateRoom, MAP_CONSTANTS };