import initPlayerStats from './initPlayerStats';
import generateMap from '../utilityLambdas/generateMap';

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
        level: 1,
        rooms: generateMap(),
        nearbyBeasts: [] //beasts placed within available space in room on generation, or on add to nearbyBeasts (AKA beast entering the room)
    }
};

export default initGameState;