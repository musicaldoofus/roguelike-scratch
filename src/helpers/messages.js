import { createContext } from 'react';

const messages = {
    log: [
        {
            type: 'inventory',
            message: 'You buy a bloody shoe.'
        }
    ],
    addTo: () => {}
};

const MessagesContext = createContext(messages);

export default MessagesContext;