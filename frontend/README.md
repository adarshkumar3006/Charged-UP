# Charged Up Frontend

React.js frontend application for the Charged Up fitness assistant.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Structure

```
src/
├── components/      
│   ├── Navbar.jsx
│   └── PrivateRoute.jsx
├── context/        
│   └── AuthContext.jsx
├── pages/         
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── WorkoutPlan.jsx
│   ├── DietPlan.jsx
│   ├── Profile.jsx
│   └── Progress.jsx
├── App.jsx          # Main app component
└── index.jsx        # Entry point
```

## Features

- Responsive design
- Dark theme UI
- Protected routes
- Real-time data updates
- Progress visualization with charts

## API Integration

The frontend communicates with the backend API running on `http://localhost:5000` (configured via proxy in package.json).

