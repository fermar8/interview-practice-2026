// Sometimes we have a value that could be one of several types. 
// We might need narrowing to figure out which type it is in order to work with it.
// The example will throw a TS error because the padding parameter could be either a number or a string, 
// and we can't call .repeat() on a string.

function padLeft(padding: number | string, input: string): string {
  return " ".repeat(padding) + input;
}

// To fix this, we can use a type guard to narrow the type of padding.
function padLeftWorking(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}

// There is also thruthiness narrowing, 
// which can be used to narrow a type based on whether a value is truthy or falsy.
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`;
  }
  return "Nobody's here. :(";
}

// We can also have equality narrowing, 
// which can be used to narrow a type based on whether two values are equal or not.
function exampleEqualityNarrowing(x: string | number, y: string | boolean) {
  if (x === y) {
    // Here, TypeScript knows that x and y must be of the same type
    // and narrows the type accordingly.
  }
}

// We can also have the in operator narrowing, 
// which can be used to narrow a type based on whether a property exists in an object or not.
type Fish = { swim: () => void };
type Bird = { fly: () => void };
 
function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }
 
  return animal.fly();
}

// We can also have the instanceof operator narrowing, 
// which can be used to narrow a type based on whether an object is an instance of a class or not.
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());     
  } else {
    console.log(x.toUpperCase());
  }
}