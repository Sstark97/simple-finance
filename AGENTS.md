# Backend

- Backend code goes in src/contexts.
- Every new feature must have its tests in tests/contexts.
# Frontend

- Frontend code goes in src/app.
- When you touch something in the frontend, use the Playwright MCP to ensure it's working properly.
- If you want to populate the database, run `make seed-database`.
- If you make a feature that involves something visual, add a Playwright test in tests/app.

# TypeScript

- DON'T use `any`. Use always explicit types.
- ALWAYS add the return type to functions.
- Dont use `||`, use `??` instead.
