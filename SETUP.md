# Quick Setup Guide

Follow these steps to get Charged Up running on your machine.

## Step 1: Install MongoDB

### Windows

1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service:
   ```powershell
   net start MongoDB
   ```

### Mac (using Homebrew)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Step 2: Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongo_db_uri
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```



4. Start the backend server:

```bash
npm run dev
```

You should see: `Server running on port 5000` and `MongoDB Connected`

## Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm start
```

The React app will automatically open in your browser at `http://localhost:3000`

## Step 4: Test the Application

1. Go to `http://localhost:3000`
2. Click "Get Started" to create an account
3. Fill in the signup form (3 steps)
4. You'll be redirected to the dashboard
5. Explore the features:
   - View your workout plan
   - Check your diet recommendations
   - Log your progress
   - Update your profile

## Troubleshooting


### Port Already in Use

- Backend: Change `PORT` in `.env` file
- Frontend: React will ask to use a different port automatically

### Module Not Found Errors

- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### CORS Errors

- Make sure backend is running on port 5000
- Check that frontend proxy is set correctly in `frontend/package.json`

## Production Build

### Build Frontend

```bash
cd frontend
npm run build
```

The build folder will contain production-ready files.

### Run Backend in Production

```bash
cd backend
NODE_ENV=production npm start
```

## Need Help?

- Check the main README.md for detailed documentation
- Review backend/README.md for API documentation
- Review frontend/README.md for frontend details
