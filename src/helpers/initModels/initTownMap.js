import generateMap from '../utilityLambdas/generateMap';
/*
Room model:
{
    id,
    type,
    dimensionality,
    tiles,
    tunnelDirections,
    portalIndices
}
*/

const initTownMap = generateMap([
    {
        roomIndex: 0,
        type: 'building',
        dimensionality: 6,
        portalIndices: { //only allowed 1 index for building types
            top: 3
        }
    },
    {
        roomIndex: 1,
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
        type: 'open',
        edges: {
            left: 'open'
        }
    }
]);

export default initTownMap;