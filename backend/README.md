# Charged Up Backend

Express.js backend server for the Charged Up fitness application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chargedup
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

3. Make sure MongoDB is running

4. Start the server:
```bash
npm run dev
```

## API Documentation

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Authentication Routes

#### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "activityLevel": "active",
  "primaryGoal": "gain_muscle",
  "constraints": ""
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "primaryGoal": "gain_muscle"
  }
}
```

#### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Routes (Protected)

#### GET /api/users/me
Get current user profile.

#### PUT /api/users/me
Update user profile.

### Workout Routes (Protected)

#### GET /api/workout/plan
Get complete workout plan.

#### GET /api/workout/today
Get today's workout.

### Diet Routes (Protected)

#### GET /api/diet/plan
Get complete diet plan.

#### GET /api/diet/today
Get today's meal suggestions.

### Progress Routes (Protected)

#### POST /api/progress
Add progress log entry.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "weight": 70.5,
  "notes": "Feeling great!",
  "workoutCompleted": true
}
```

#### GET /api/progress
Get all progress logs.

#### GET /api/progress/stats
Get progress statistics.

#### DELETE /api/progress/:id
Delete a progress entry.

