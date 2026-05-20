// We need a way of capturing the type of the argument in such a way that we can also use it to denote what is being returned. 
// we will use a type variable, a special kind of variable that works on types rather than values.

function identity<Type>(arg: Type): Type {
  return arg;
}

// This Type allows us to capture the type the user provides (e.g. number), 
// so that we can use that information later. 
// Here, we use Type again as the return type.
// Once we’ve written the generic identity function, we can call it in one of two ways. 
// The first way is to pass all of the arguments, 
// including the type argument, to the function:
let output = identity<string>("myString");

// The second way is also perhaps the most common. Here we use type argument inference
let output2 = identity("myString");

// When you start needing a generic is when you truly don't know what type is going to be passed 
// into the function or you have things inside the function that rely on knowing that type

