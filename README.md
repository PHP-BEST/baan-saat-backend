# Development Guide

This guide outlines how to set up, develop, test, and maintain the `baan-saat-backend` project.

---

## Prerequisites

- **Node.js**
- **npm**
- **MongoDB**

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/PHP-BEST/baan-saat-backend.git
   cd baan-saat-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

- Create a `.env` file in the root directory with the variables in [.env.example](/.env.example)
- Create a `.env` file in the root directory with the variables in [.env.example](/.env.example)

## Running the Application

To start the development server:

```bash
npm run dev
```

This code normally runs on `localhost:5000`

## Project Structure

```
src/
  configs/      # Configuration files (e.g., MongoDB connection)
  controllers/  # Express route handlers
  models/       # Mongoose schemas and models
  routes/       # Express route definitions
  tests/        # Jest and Supertest tests
  server.ts     # Application entry point
```

## Code Quality

- **Linting**: Run `npm run lint` to check code style with ESLint.
- **Formatting**: Run `npm run format` to check the code format with Prettier

## Testing

- **Run tests**: `npm test`
- Test files are located in `src/tests/`.

## API Documentation

- **Swagger UI** is available at `/api-docs` when the server is running.

## Workflow & Branching

1. **Create a New Branch**
   - Always create a new branch from the latest `developer` branch before starting work.
   - Use a descriptive branch naming convention based on your task type:
     - For new features: `feat/<feature-name>`
     - For bug fixes: `fix/<short-description>`
     - For documentation: `docs/<short-description>`
     - For refactoring: `refactor/<short-description>`
     - For chores/maintenance: `chore/<short-description>`
     - For new features: `feat/<feature-name>`
     - For bug fixes: `fix/<short-description>`
     - For documentation: `docs/<short-description>`
     - For refactoring: `refactor/<short-description>`
     - For chores/maintenance: `chore/<short-description>`
   - Example:

     ```bash
     git checkout developer
     git pull
     git checkout -b feat/user-auth
     git checkout -b feat/user-auth
     ```

2. **Commit and Push Changes**
   - Write clear and concise commit messages.
   - Use a descriptive naming convention based on your task type:
     - For new features: `feat: <feature-name>`
     - For bug fixes: `fix: <short-description>`
     - For documentation: `docs: <short-description>`
     - For refactoring: `refactor: <short-description>`
     - For chores/maintenance: `chore: <short-description>`
   - Example:

     ```bash
     git commit -m "fix: add authentication"
     ```

   - Use a descriptive naming convention based on your task type:
     - For new features: `feat: <feature-name>`
     - For bug fixes: `fix: <short-description>`
     - For documentation: `docs: <short-description>`
     - For refactoring: `refactor: <short-description>`
     - For chores/maintenance: `chore: <short-description>`
   - Example:

     ```bash
     git commit -m "fix: add authentication"
     ```

   - Push your branch to the remote repository.

3. **Open a Pull Request**
   - Merge your feature/fix branch **only into the `developer` branch** (never directly into `main`).
   - Assign reviewers if required, and wait for approval before merging.
   - After merging branches, I recommend deleting your working branch and recreate it from new developer branch...
   - After merging branches, I recommend deleting your working branch and recreate it from new developer branch...

4. **Never Commit Directly to `main` or `developer`**
   - All changes must be made through pull requests from a feature/fix branch.

---
