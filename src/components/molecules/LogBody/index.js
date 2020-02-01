import React from 'react';

const LogBody = ({messages}) => {
    return (
        <div className="log-body-inner-container">
            {messages.map((m, i) => (
                <div key={m.value.concat(i)}>
                    <span>{m.value}</span>
                </div>
            ))
        }
        </div>
    );
}

export default LogBody;