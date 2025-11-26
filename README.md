# Charged Up - Personal Fitness Assistant

A full-stack React + Node.js fitness application that provides personalized workout plans and diet recommendations based on user profiles, goals, and preferences.

## Features

-  **User Authentication** - Secure signup/login with JWT tokens
-  **Personalized Workout Plans** - Custom workout routines based on goals, equipment, and fitness level
-  **Smart Diet Recommendations** - Meal plans tailored to calorie needs and dietary preferences
-  **Progress Tracking** - Log weight, workouts, and visualize progress with charts
-  **User Profiles** - Comprehensive profile management with preferences
-  **Goal-Based System** - Support for weight loss, muscle gain, endurance, and maintenance goals

## Tech Stack

### Frontend

- React.js 18
- React Router DOM
- Axios for API calls
- Recharts for data visualization
- CSS3 with modern styling

### Backend

- Node.js
- Express.js

## Charged Up — Personal Fitness Assistant

Charged Up is a full-stack web app (React + Vite frontend, Node + Express backend) that provides personalized workout plans, diet recommendations, and progress tracking.

---

## Key Features

- Secure user authentication (JWT)
- Personalized workout plans and schedules
- Smart diet recommendations and calorie calculations
- Progress tracking and charts
- User profile with preferences and goals

## Tech Stack

- Frontend: React 18, Vite, React Router v6, Axios, Recharts
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT, bcrypt

## Requirements

- Node.js 22.x LTS (recommended) or >= 20.19
- npm (bundled with Node)
- MongoDB (local or Atlas)

## Setup (Windows PowerShell)

# Using SSH (recommended if you have SSH keys)
git clone git@github.com:adarshkumar3006/ChargedUP.git

# Or using HTTPS
git clone https://github.com/adarshkumar3006/ChargedUP.git

1. Backend

```powershell
cd "C:\Users\ASUS\Downloads\ChargedUP\Charged-up\backend"
npm install
# create .env with MONGODB_URI, JWT_SECRET, PORT
npm run dev    # uses nodemon if configured, otherwise npm start
```

2. Frontend

```powershell
cd "C:\Users\ASUS\Downloads\ChargedUP\Charged-up\frontend"
npm install
npm start
```

Notes:

- If Vite reports a Node version error, install Node 22.x LTS from https://nodejs.org and reopen PowerShell.
- The frontend dev server runs on `http://localhost:3000` and proxies `/api` to `http://localhost:5000`.

## File Layout 

```
frontend/
  ├─ index.html           # Vite entry
  ├─ src/
  │  ├─ index.jsx         # app bootstrap
  │  ├─ App.jsx
  │  ├─ components/       # Navbar.jsx, PrivateRoute.jsx
  │  ├─ context/          # AuthContext.jsx
  │  └─ pages/            # Dashboard.jsx, Login.jsx, etc.
backend/
  ├─ server.js
  ├─ routes/
  └─ models/
```

## Running in Development

- Start backend (port 5000): `npm run dev` inside `backend`
- Start frontend (port 3000): `npm start` inside `frontend`

## Future Enhancements

- AI-driven personalization (model suggestions for workouts and meals)
- Social features and leaderboards
- Mobile app / React Native version
- Integration with wearable APIs (Fitbit, Apple Health)
- Exportable meal plans and shopping lists


Screenshots:
<img width="1873" height="514" alt="image" src="https://github.com/user-attachments/assets/d414e9e9-9eac-4278-b8cc-2b0a59fe0344" />
<img width="1902" height="854" alt="Screenshot 2025-11-26 233938" src="https://github.com/user-attachments/assets/0c031f08-bd04-4895-bccd-f82918589044" />
<img width="1909" height="945" alt="Screenshot 2025-11-26 233826" src="https://github.com/user-attachments/assets/accdce16-090e-4601-bae2-6272a6aa633d" />
<img width="1410" height="941" alt="Screenshot 2025-11-26 233846" src="https://github.com/user-attachments/assets/f97d366f-8771-4334-b633-3faa3d5e8284" />
<img width="1032" height="651" alt="Screenshot 2025-11-26 233907" src="https://github.com/user-attachments/assets/8934afcc-6ea4-48e6-b85b-29cf3b8fcd9d" />
<img width="1915" height="942" alt="Screenshot 2025-11-26 233814" src="https://github.com/user-attachments/assets/48df4fdb-be03-4eb6-b7ca-4bef030466a3" />



