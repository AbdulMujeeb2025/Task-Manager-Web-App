# Backend Setup Guide

## Steps to run the backend:

1. Open terminal in backend folder:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Server will start on port 4000

## API Endpoints:

- POST /auth/register - Register new user
- POST /auth/login - Login
- GET /tasks - Get all tasks (private)
- POST /tasks - Create task (private)
- PUT /tasks/:id - Update task (private)
- DELETE /tasks/:id - Delete task (private)
- GET /projects - Get all projects (private)
- POST /projects - Create project (private)
- PUT /projects/:id - Update project (private)
- DELETE /projects/:id - Delete project (private)
- GET /user/profile - Get user profile (private)
- PUT /user/profile - Update profile (private)
- DELETE /user/profile - Delete account (private)
