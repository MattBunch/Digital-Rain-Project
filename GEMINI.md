# Project Rules

## JavaScript Coding Style

- **Braces:** Always use curly brackets `{}` for all control structures (`if`, `else`, `for`, `while`), even if the body is a single line.
- **Variable Declaration:** Always prefer `const` over `let`.
  - Only use `let` when you explicitly intend to reassign the variable.
  - Never use `var`.
- **Object/Array Mutability:** Note that `const` allows modifying properties/elements; use this for objects and arrays unless the entire reference must change.

## project structure

Do **not** delete `src/app.js` so you can use it as a reference for how the functionality is supposed to work - (legacy file) - don't write unit tests for it either.

## linting, formatting

Always run the following two commands after completing each implemention to ensure linting/formatting is followed: 

```bash
npx eslint . --fix
npx prettier --write .
```