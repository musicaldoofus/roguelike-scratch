import samplePlayerStats from './samplePlayerStats';
import initRoom from './initRoom';

const initGameState = {
    player: samplePlayerStats,
    log: {
        metadata: {

        },
        messages: [{
            type: 'general',
            value: 'Started game.'
        }]
    },
    location: {
        level: 1,
        rooms: initRoom,
        nearbyBeasts: [] //beasts placed within available space in room on generation, or on add to nearbyBeasts (AKA beast entering the room)
    }
};

export default initGameState;