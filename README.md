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

### Core Features ✅
- **User Authentication**: Email/password registration and login with JWT
- **JWT Token Management**: Secure token-based authentication with 7-day expiry
- **Role-Based Access Control**: User and Admin roles with authorization
- **Protected Routes**: Secure frontend and backend routes
- **Password Encryption**: Bcryptjs for secure password hashing
- **State Management**: Redux Toolkit for global auth state
- **Responsive UI**: Fully responsive Tailwind CSS design

### Community Features ✅
- **Post Management**: Create, read, update, delete posts (CRUD)
- **Comment System**: Comment on posts, edit/delete own comments
- **Like System**: Like/Unlike posts and comments with tracking
- **Admin Moderation**: Official admin replies clearly distinguished
- **Content Pagination**: Paginated feeds for optimal performance
- **User Engagement**: Track likes, comments, and interactions

### Admin Dashboard ✅
- **Moderation Dashboard**: View all posts for management
- **Content Management**: Delete or manage user posts/comments
- **Official Responses**: Post official admin replies to user posts
- **User Management**: Admin-specific controls and oversight

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
├── frontend/                    # React.js Frontend (Vite)
│   ├── src/
│   │   ├── assets/              # Images, animations
│   │   │   └── core/Auth/       # Auth components
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── home.jsx
│   │   │   ├── login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── user-dashboard.jsx        # User feed & posts
│   │   │   ├── admin-dashboard.jsx       # Admin moderation
│   │   │   └── unauthorized.jsx
│   │   ├── service/
│   │   │   ├── apiconnector.js
│   │   │   ├── apis.js
│   │   │   └── operations/
│   │   │       ├── authAPI.js
│   │   │       ├── postAPI.js            # Post operations ✨ NEW
│   │   │       ├── commentAPI.js         # Comment operations ✨ NEW
│   │   │       └── adminAPI.js           # Admin operations ✨ NEW
│   │   ├── slices/
│   │   │   └── authSlice.js
│   │   ├── store.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── README.md
│
├── server/                      # Node.js/Express.js Backend
│   ├── config/
│   │   └── database.js
│   ├── controller/
│   │   ├── authController.js
│   │   ├── postController.js            # Post CRUD ✨ NEW
│   │   ├── commentController.js         # Comment CRUD ✨ NEW
│   │   └── adminController.js           # Admin moderation ✨ NEW
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── model/
│   │   ├── user.js
│   │   ├── post.js                      # Post schema ✨ NEW
│   │   ├── commen & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd newway
```

### Step 2: Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB credentials and JWT secret
npm run dev
# Backend runs on http://localhost:4002
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:4002" > .env.local
npm run dev
# Frontend runs on http://localhost:5173
```

### MongoDB Setup
- **Local**: Install MongoDB and ensure service is running
- **Atlas**: Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Update MONGODB_URI in your backend .env file

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
Terminal 1: Start Backend
```bash
cd server
npm run dev
# Runs on http://localhost:4002
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Both servers must be running for full functionality!**bash
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
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/newways
PORT=4002
JWT_SECRET=your_secret_key_here
TOKEN_EXPIRY=7d
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:4002
```

See `.env.example` files for template configurations.firstName": "John",
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
    "id": "user_id" Overview

### Authentication (`/api/v1/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login with email/password
- `POST /logout` - Logout user

### Posts (`/api/v1/posts`)
- `POST /` - Create post
- `GET /` - Get all posts (paginated)
- `GET /:id` - Get post by ID
- `PUT /:id` - Update post
- `DELETE /:id` - Delete post
- `POST /:id/like` - Like/Unlike post

### Comments (`/api/v1/comments`)
- `POST /` - Create comment
- `GET /post/:postId` - Get post comments
- `PUT /:id` - Update comment
- `DELETE /:id` - Delete comment
- `POST /:id/like` - Like/Unlike comment

### Admin (`/api/v1/admin`)
- `POST /reply` - Post official reply (admin only)
- `GET /replies/:postId` - Get admin replies
- `PUT /reply/:id` - Update reply (admin only)
- `DELETE /reply/:id` - Delete reply (admin only)
- `GET /moderation/posts` - Get posts for moderation (admin only)

**📖 [Full API Documentation](./API_DOCUMENTATION.md)**
- View profile information in the dashboard
- Sessions are managed via JWT tokens stored in cookies
- Tokens are automatically included in API requests

---

## 📦 Building for Production

### Frontend Build

```bash
cd frontend
npm run build
``` Guide

### 1. User Registration
- Navigate to `/signup`
- Enter name, email, password
- Submit to create account (default: User role)

### 2. User Login
- Navigate to `/login`
- Enter email and password
- Redirected to user dashboard

### 3. Create & Manage Posts
- From user dashboard, write post content
- Click "Post" to publish
- Posts appear in feed for all users
- Edit or delete your own posts

### 4. Comment & Engage
- Click on a post to view details
- Add comments as authenticated user
- Like posts and comments
- Edit/delete own comments

### 5. Admin Features
- Login with admin account
- Access admin dashboard at `/admin/dashboard`
- View all posts for moderation
- Post official replies (marked as admin)
- Delete any post/comment if needed

### 6. Logout
- Click logout button
- Token cleared from storage
- Redirected to home page

---

## 🔒 Security Features

✅ JWT Authentication with expiry
✅ Password hashing with bcryptjs
✅ Role-based access control
✅ Authorization middleware
✅ Input validation on server
✅ CORS protection
✅ Protected routes
✅ Ownership verification

---

## 📦 Production Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Heroku/Railway)
```bash
# Set production environment variables
# Deploy to Heroku or Railway
```

### Database
- Use MongoDB Atlas for production
- Set proper security rules and backups
- Whitelist production IPs

---

## 📊 Data Models

**User**: Contains profile and role information
**Post**: Main content unit created by users
**Comment**: User responses to posts
**AdminReply**: Official moderated responses (admin only)

All models include timestamps and proper relationships.
---

## ✋ Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Happy coding! 🎉**
