// Functional components in React are JavaScript functions that return JSX, 
// which is a syntax extension for JavaScript that looks similar to HTML. 
// They are a simpler way to create components in React compared to class components.

// Functional components can accept props as an argument, which are used to pass data from a parent component to a child component.
// Props are passed to a functional component as an object, and they can be accessed using dot notation.
function Greeting(props: { name: string }) {
    return <h1>Hello, {props.name}!</h1>;
}
// Props are read-only, meaning that a functional component cannot modify the props it receives.
// They can also use hooks, which are functions that allow you to use state and other React features in functional components.