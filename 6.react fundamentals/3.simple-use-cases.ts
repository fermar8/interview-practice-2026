// We will explore some basic use cases of React.

//1.Rendering lists
// We can render lists in React using the map function to iterate over an array of data and return a JSX element for each item in the list.
// When rendering lists, it is important to provide a unique key for each item to help React identify which items have changed, are added, or are removed.
// Conditional rendering can be achieved using JavaScript logical operators like && or the ternary operator (? :).

// Here is an example of rendering a list of items in React:

import React from 'react';

function ItemList(props: { items: string[] }) {
    return (
        <ul>
            {props.items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
}

// And conditional rendering:
function Greeting(props: { isLoggedIn: boolean }) {
    return (
        <div>
            {props.isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign up.</h1>}
        </div>
    );
}

//2. Controlled forms
// Controlled forms in React are forms that are controlled by the state of the component. 
// The form elements (like input, textarea, select) have their value set to the state variable, and they update the state variable on change using an event handler.
// This allows us to have full control over the form data and makes it easier to handle form submissions and validations.

import { useState } from 'react';

function NameForm() {
    const [name, setName] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        alert('A name was submitted: ' + name);
        event.preventDefault();
    // preventDefault is used to prevent the default form submission behavior, which would cause the page to reload.
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={handleChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}  

//3. Fetching data from an API
// We can fetch data from an API in React using the useEffect hook to perform the side effect of fetching data when the component mounts.
// We can use the fetch API or any other library like axios to make the HTTP request and update the state with the fetched data.
// Handle errors and loading states appropriately when fetching data from an API to provide a better user experience.
// We can also use async/await syntax for better readability when fetching data from an API in React.
// An example of error handling and loading state management when fetching data from an API in React:

function DataFetcherWithErrorHandling() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.example.com/data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setData(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Data:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

// 4. Lifting state up
// Lifting state up is a common pattern in React where we move the state to the closest common ancestor of the components that need to access it.
// This allows us to share state between components and keep the state management centralized.
// We can lift state up by passing the state and the function to update it as props to the child components that need to access it.
function ParentComponent() {
    const [sharedState, setSharedState] = useState('Initial state');
    return (
        <div>
            <ChildComponent1 sharedState={sharedState} setSharedState={setSharedState} />
            <ChildComponent2 sharedState={sharedState} />
        </div>
    );
}

function ChildComponent1(props: { sharedState: string; setSharedState: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <div>
            <h2>Child Component 1</h2>
            <p>Shared State: {props.sharedState}</p>
            <button onClick={() => props.setSharedState('Updated state from Child 1')}>Update State</button>
        </div>
    );
}

function ChildComponent2(props: { sharedState: string }) {
    return (
        <div>
            <h2>Child Component 2</h2>
            <p>Shared State: {props.sharedState}</p>
        </div>
    );
}  
// In this example, the ParentComponent holds the shared state and passes it down to both ChildComponent1 and ChildComponent2.
// ChildComponent1 can update the shared state, and both components will reflect the updated state when it changes.