// A component renders some UI and can have state and side effects.
// Hooks are functions that let you "hook into" React features from functional components. 
// They allow you to use state and other React features without writing a class component.                                                                                                        

// useState is a hook that allows you to add state to a functional component.
// It returns an array with two elements: the current state value and a function to update it.
// useState triggers re-render of the component when the state is updated, allowing the UI to reflect the new state.
// it is important to not mutate the state directly, but instead use the provided function to update it, 
// as this ensures that React can properly track changes and re-render the component when necessary.

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

// useEffect is a hook that allows you to perform side effects in a functional component.
// It takes a function as an argument, which will be called after the component renders.
// You can also specify dependencies for the effect, so it only runs when those dependencies change.
// It has side-effects (use cases) such as fetching data, setting up subscriptions, and manually changing the DOM in React components.
// It is important to clean up any side effects in the return function of useEffect to avoid memory leaks and other issues.
// Dependency array is used to control when the effect runs. 
// If you pass an empty array ([]), the effect will only run once when the component mounts.
// If you pass an array with dependencies ([count]), the effect will run every time the count variable changes.



import { useEffect } from 'react';

function Timer() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

        // The empty dependency array means this effect will only run once when the component mounts.

    return <p>Seconds: {seconds}</p>;
}

// useContext is a hook that allows you to access the context value in a functional component.
// It takes a context object created by React.createContext and returns the current context value.
import { useContext } from 'react';

const ThemeContext = React.createContext('light');

function ThemedComponent() {
    const theme = useContext(ThemeContext);
    return <p>Current theme: {theme}</p>;
}
