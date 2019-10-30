import React, { useContext } from 'react';
import Context from './hookRedux';

function Child() {
    // const [count, setCount] = useState(context);
    const context = useContext(Context.count);
    console.log(context)
    return (
        <div>
            <h3>{context}</h3>
            {/* <button onClick={()=> setCount(count -1)}></button> */}
        </div>
    )
}
export default Child;