// Types have more flexibility. 
// For example you can declare a type as a union or intersection of other types, 
// or as a tuple, which you cannot do with interfaces.

type StringOrNumber = number | string; // Union type, it is one of the two types
type Cat = { purrs: boolean } & { colour: string }; // Intersection type, it has all the properties of both types
type Point = [number, number]; // Tuple type, it has a fixed number of elements with specific types in each index