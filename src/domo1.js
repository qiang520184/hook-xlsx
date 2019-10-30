import React, { useState,useEffect,createContext,useContext,useReducer } from 'react';
import Child from './child';
// import Context from './hookRedux';
const CountContext = createContext();

function DemoChild() {
    const context = useContext(CountContext);

    const [counts, dispath] = useReducer((state,action) => {
        switch (action) {
            case 'add':
                    return state + 1;
                break;
        
            default:
                    return state - 1;
                break;
        }
    }, 10);
    // const [count, setCount] = useState(context);
    return (
        <div>
            <h3>DemoChild</h3>
            {/* <h3>{context}</h3> */}
            <h1>{counts}</h1>
            <button onClick={()=> dispath('add')}>点击添加</button>
            <button onClick={()=> dispath()}>点击减少</button>

        </div>
    )
}

function Example() {
    const [count, setCount] = useState(0);
    useEffect(()=> {
        console.log(`我点击了button${count}次`)
        // return () => {
        //     console.log(`example1被卸载了`)
        // }
    })
    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count+1)}>点击</button>
            {/* <Context.Provider value={{count}} name>
                <DemoChild></DemoChild>
                <Child></Child>
            </Context.Provider> */}
            {/* <DemoChild></DemoChild> */}
            <CountContext.Provider value={count}>
                <DemoChild></DemoChild>
            </CountContext.Provider>
        </div>
    )
}

export default Example
