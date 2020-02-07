import generateMap, { MAP_CONSTANTS } from '../utilityLambdas/generateMap';

const initTownMap = generateMap([
    {
        roomIndex: 0,
        coords: {
            x: Math.floor(MAP_CONSTANTS.MAP_VISIBLE_DIMENSIONALITY_MAX / 2),
            y: Math.floor(MAP_CONSTANTS.MAP_VISIBLE_DIMENSIONALITY_MAX / 2)
        },
        type: 'building',
        dimensionality: 6,
        portalIndices: { //only allowed 1 index for building types
            top: 3
        }
    },
    {
        roomIndex: 1,
        coords: {
            x: 0,
            y: 0
        },
        type: 'open',
        structsInRoom: [{
            coords: {
                x: 12,
                y: 20
            },
            portalIndex: 3, //relative to coordinates, not absolute tile index
            roomIndex: 0
        }],
        edges: {
            right: 'open'
        }
    },
    {
        roomIndex: 2,
        coords: {
            x: MAP_CONSTANTS.MAP_VISIBLE_DIMENSIONALITY_MAX,
            y: 0
        },
        type: 'open',
        edges: {
            left: 'open'
        }
    }
]);

export default initTownMap;