# Development Guide

This guide outlines how to set up, develop, test, and maintain the `baan-saat-backend` project.

---

## Prerequisites

- **Node.js**
- **npm**
- **MongoDB**

## Installation

1. **Clone this repository:**

   ```bash
   git clone https://github.com/PHP-BEST/baan-saat-backend.git
   cd baan-saat-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Environment Setup

- Create a `.env` file in the root directory with the variables in [.env.example](/.env.example)

## Running the Application

- **Start the development server:**
  ```bash
  npm run dev
  ```
- By default, the app runs on `localhost:5000`.

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

- **Linting:**
  ```bash
  npm run lint
  ```
- **Formatting:**
  ```bash
  npm run format
  ```

## Testing

- **Run tests:**
  ```bash
  npm test
  ```
- Test files are located in `src/tests/`.

## API Documentation

- **Swagger UI** is available at [http://localhost:5000/api-docs](http://localhost:5000/api-docs) when the server is running.

## Workflow & Branching

1. **Create a New Branch**
   - Always create a new branch from the latest `developer` branch before starting work.
   - Use a descriptive branch naming convention based on your task type:
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
     ```

2. **Commit and Push Changes**
   - Write clear and concise commit messages.
   - Use the following commit message convention:
     - For new features: `feat: <feature-name>`
     - For bug fixes: `fix: <short-description>`
     - For documentation: `docs: <short-description>`
     - For refactoring: `refactor: <short-description>`
     - For chores/maintenance: `chore: <short-description>`
   - Example:
     ```bash
     git add .
     git commit -m "feat: add user authentication"
     git push origin feat/user-auth
     ```

3. **Open a Pull Request**
   - **On GitHub**, open a pull request from your feature/fix branch to the `developer` branch (never directly into `main`).
   - Assign reviewers if required.
   - Wait for approval and merge.
   - After merging, **delete your working branch** and recreate it from the updated `developer` branch for your next task:
     ```bash
     git checkout developer
     git pull
     git branch -d feat/user-auth
     git checkout -b feat/another-feature
     ```

4. **Never Commit Directly to `main` or `developer`**
   - All changes must be made through pull requests from a feature/fix branch.

---

**Before starting any new work, always pull and merge the latest changes from the `developer` branch into your feature branch:**

```bash
git checkout developer
git pull
git checkout <your-feature-branch>
git merge developer
```

**Do not attempt to fix conflicts directly in the `developer` branch.**

---
