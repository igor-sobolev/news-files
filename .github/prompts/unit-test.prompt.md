# Purpose

Write unit tests for given module

## Guidelines

- Each function should have own `describe` block
- Reusable `setup` function to support multiple test cases with overridable parameters
- Test both success and failure paths, including edge cases
- Use clear and descriptive test names that explain the scenario being tested
- Mock dependencies and external calls to isolate the unit being tested
- Ensure tests are deterministic and do not rely on external state or timing
- Use fixtures or factory functions to create consistent test data
- Co-locate tests with the implementation files using `*.test.ts` and `*.test.tsx` naming conventions
