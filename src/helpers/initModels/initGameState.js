import initPlayerStats from './initPlayerStats';
//import generateMap from '../utilityLambdas/generateMap';
import initTownMap from './initTownMap';

const initGameState = {
    turn: 0,
    player: initPlayerStats,
    log: {
        messages: [{
            ctx: 'general',
            value: 'Started game.'
        }]
    },
    location: {
        level: 0,
        rooms: initTownMap,//generateMap(),
        nearbyBeasts: [] //beasts placed within available space in room on generation, or on add to nearbyBeasts (AKA beast entering the room)
    }
};

export default initGameState;