# LMS Backend

## Setup
1. Install dependencies: `npm install`
2. Set up MongoDB connection in `.env`
3. Start server: `npm run dev`

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Admin
- POST `/api/admin/users` - Create user
- GET `/api/admin/users` - Get all users
- POST `/api/admin/tasks` - Create task

### Learner
- GET `/api/learner/tasks` - Get assigned tasks
- POST `/api/learner/tasks/:id/submit` - Submit task

### Accessor
- GET `/api/accessor/tasks` - Get submitted tasks
- POST `/api/accessor/tasks/:id/assess` - Assess task (pass/fail)

### IQA
- GET `/api/iqa/tasks` - Get passed tasks
- POST `/api/iqa/tasks/:id/review` - Review task quality

### EQA
- GET `/api/eqa/tasks` - Get IQA passed tasks
- POST `/api/eqa/tasks/:id/review` - Final review

## User Roles
- admin: Full system access
- learner: Submit tasks
- accessor: Assess submissions
- iqa: Quality assurance
- eqa: External quality assurance