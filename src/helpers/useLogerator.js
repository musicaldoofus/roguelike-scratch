import { useContext } from 'react';
import messages from  './messages';

const useLogerator = (message) => {
    console.log('got message', message);

    const messagesContext = useContext(messages);

    messagesContext.addTo(message);

    return messagesContext;
}

export default useLogerator;