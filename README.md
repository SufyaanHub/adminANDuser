# NewWay - Authentication System

A full-stack authentication system built with React and Express.js, featuring user registration, login, JWT authentication, and role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)

---

## ✨ Features

- **User Authentication**: Register and login with email/password
- **Google OAuth Integration**: Sign up/login with Google account
- **JWT Token Management**: Secure token-based authentication
- **Password Encryption**: Bcrypt for secure password hashing
- **Role-Based Access Control**: Admin and User roles
- **Protected Routes**: Special dashboard pages for authenticated users
- **Responsive UI**: Built with Tailwind CSS for modern design
- **State Management**: Redux Toolkit for global state management

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT (jsonwebtoken)** - Authentication tokens
- **Bcryptjs** - Password encryption
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling

---

## 📋 Prerequisites

Before running the project, ensure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB** - Database (local or cloud - MongoDB Atlas recommended)
- **Git** - Version control

---

## 📁 Project Structure

```
newway/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── assets/              # Images, animations
│   │   │   └── core/
│   │   │       └── Auth/        # Authentication components
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   │   ├── login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── admin-dashboard.jsx
│   │   │   ├── user-dashboard.jsx
│   │   │   └── unauthorized.jsx
│   │   ├── service/             # API calls
│   │   │   └── operations/
│   │   ├── slices/              # Redux slices
│   │   ├── reducer/             # Redux reducer
│   │   ├── store.js             # Redux store configuration
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── server/                      # Express.js backend
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controller/              # Business logic
│   │   ├── authController.js
│   │   └── login.js
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── model/
│   │   └── user.js              # User schema
│   ├── routes/
│   │   └── authRoutes.js        # Auth endpoints
│   ├── index.js                 # Server entry point
│   ├── package.json
│   └── config/
│       └── .env                 # Environment variables
│
└── README.md                    # Project documentation
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd newway
```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd ../server
npm install
```

### Step 4: Setup MongoDB

#### Option A: Local MongoDB
- Install MongoDB on your system
- Ensure MongoDB service is running

#### Option B: MongoDB Atlas (Cloud)
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get your connection string

---

## 🏃 Running the Project

### Option 1: Run Frontend and Backend Separately

#### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
```

The backend server will start on `http://localhost:5000` (or port specified in your config)

#### Terminal 2 - Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Option 2: Run Both Simultaneously (Using npm-run-all)

1. Install npm-run-all globally:
```bash
npm install -g npm-run-all
```

2. From the root directory:
```bash
npm install
npm run dev
```

---

## 🔧 Environment Variables

### Backend (.env)

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
# OR for local MongoDB
MONGODB_URL=mongodb://localhost:27017/newway

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Port
PORT=5000

# CORS Origins
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Google OAuth (if implementing OAuth)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## 📡 API Endpoints

### Authentication Endpoints

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "user" // or "admin"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "userType": "user"
  }
}
```

---

## 💻 Usage

### 1. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### 2. User Registration

- Click on "Sign Up"
- Fill in the registration form
- Choose user type (User or Admin)
- Submit to create account

### 3. User Login

- Click on "Login"
- Enter email and password
- Click "Sign In"
- Get redirected to user dashboard

### 4. Role-Based Access

- **User**: Access user dashboard at `/user-dashboard`
- **Admin**: Access admin dashboard at `/admin-dashboard`
- Unauthorized users will see the unauthorized page

### 5. Using the Application

- View profile information in the dashboard
- Sessions are managed via JWT tokens stored in cookies
- Tokens are automatically included in API requests

---

## 📦 Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist` folder.

### Backend Deployment

1. Set production environment variables
2. Use PM2 or similar process manager:

```bash
npm install -g pm2
pm2 start server/index.js --name "newway-backend"
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Connection refused (Backend)** | Ensure MongoDB is running and connection string is correct |
| **CORS errors** | Check CORS configuration in `server/index.js` - add your frontend URL |
| **Invalid token errors** | Clear browser cookies and login again |
| **Port already in use** | Change the port in your config or kill the process using that port |

---

## 📝 Available Scripts

### Frontend

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Backend

```bash
npm run dev       # Start server with nodemon
npm start         # Start server normally
```

---

## 🤝 Contributing

Feel free to fork, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## ✋ Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Happy coding! 🎉**
