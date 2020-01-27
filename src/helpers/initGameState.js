import samplePlayerStats from './samplePlayerStats';

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
        nearbyBeasts: []
    }
};

export default initGameState;