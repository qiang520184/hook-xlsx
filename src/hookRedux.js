import React, {createContext } from 'react';

const Context = createContext({
    color: 'red',
    arr: [123],
    count: 1
});

export default Context