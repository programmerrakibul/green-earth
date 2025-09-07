# Assignment 06

## Questions and Answers

### 1. What is the difference between var, let, and const?

- var is `global scoped` variable and const, let is `block scoped`

- All three hoisted but const and let stay in the `Temporal Dead Zone`

- const is `immutable`, can't reassign values and let is `mutable` but safer
  than var

```js
// Example - 1
console.log(name1);
var name1 = "Rakibul Islam";

// Example - 2
console.log(name2);
var name2 = "Rakibul Islam";

// Example - 2
console.log(name3);
var name3 = "Rakibul Islam";
```

Example 1 will log undefined but Example 2 and 3 will throw an error

### 2. What is the difference between map(), forEach(), and filter()?

- If I want to `modify` an array without changing the original array, map can
  help me with that. map() `transforms` each element of an array and
  `returns a new array`

```js
const marks = [72, 68, 84, 64];
const newMarks = marks.map((mark) => mark * 0.5);

console.log(newMarks); // Output: [36,34,42,32]
```

- forEach() doesn't return any value, it always `returns undefined`. If I don't
  need any value in return I can use forEach cause doesn't return value.

- filter() returns a new array with the test passes values. If test cases
  doesn't match it will still return an empty array

### 3. What are arrow functions in ES6?

Arrow function is a short version of regular function. Arrow functions are
`anonymous function expression`. `()=>{}` arrow functions are like this. If I
have one parameter, I don't need parentheses.

If I need to return one line of code, then I don't have to write expression into
curly bracket, I can write one line code and don't have to use return keyword in
one line arrow function.

### 4. How does destructuring assignment work in ES6?

Destructuring assignment in ES6 is a powerful syntax. We can `unpack values`
from array or properties from objects.

We can destruct `values` from an array based on their `position` and object
`properties` by their `prop name`.

### 5. Explain template literals in ES6. How are they different from string concatenation?

Template literals in ES6 are a modern, expressive way to work with strings.
Template literals are strings wrapped in backticks instead of quotes. It allow
us to write single expression, ${} inside of this. No need to write multiline
like \n. And hard concatenation.
