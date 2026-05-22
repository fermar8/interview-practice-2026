// useState is a hook that allows you to add state to a functional component.
//  It returns an array with two elements: the current state value and a function to update it.

import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0); // count is the state variable, setCount is the function to update it

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    );
}



