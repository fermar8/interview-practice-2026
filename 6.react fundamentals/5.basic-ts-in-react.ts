// Basic typescript usage in React components
// TypeScript can be used in React components to add type safety and improve code quality.
// You can define the types of props, state, and other variables in your React components using TypeScript.
// This helps catch errors early and provides better documentation for your code.
// Example of using TypeScript in a React component:

import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState<number>(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

// In this example, we define the type of the state variable 'count' as 'number' using useState<number>(0).

// We can also use Typescript to define the types of props for a functional component:

function Greeting(props: { name: string }) {
    return <h1>Hello, {props.name}!</h1>;
}
