# MERN Community Platform - API Documentation

## Project Overview

This is a complete MERN (MongoDB, Express.js, React.js, Node.js) stack community platform with role-based authentication and content moderation features.

## Tech Stack

- **Frontend**: React 19, Vite, Redux Toolkit, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js 5, Mongoose, JWT Authentication
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based Role-Based Access Control (RBAC)

## Features Implemented

### 1. **User Authentication** ✅
- User signup with email and password
- User login with JWT token
- Role-based access (User/Admin)
- Protected routes for authenticated users

### 2. **Post Management** ✅
- Create posts (authenticated users only)
- View all posts (public)
- View specific post details
- Update own posts
- Delete own posts (users) or any post (admins)
- Like/Unlike posts

### 3. **Comments System** ✅
- Comment on posts (authenticated users only)
- View all comments for a post
- Update own comments
- Delete own comments (users) or any comment (admins)
- Like/Unlike comments

### 4. **Admin Moderation** ✅
- Post official admin replies to posts
- Update admin replies
- Delete admin replies
- View all posts for moderation
- Manage user-generated content

---

## Backend API Endpoints

### Base URL: `http://localhost:4002/api/v1`

### Authentication Endpoints (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/auth/signup` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/logout` | Logout user | ✅ |

### Post Endpoints (`/posts`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---|---|
| POST | `/posts` | Create new post | ✅ | User/Admin |
| GET | `/posts` | Get all posts (paginated) | ❌ | - |
| GET | `/posts/:id` | Get post by ID | ❌ | - |
| PUT | `/posts/:id` | Update post | ✅ | Owner/Admin |
| DELETE | `/posts/:id` | Delete post | ✅ | Owner/Admin |
| POST | `/posts/:id/like` | Like/Unlike post | ✅ | User/Admin |

**Example Request - Create Post:**
```bash
curl -X POST http://localhost:4002/api/v1/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "This is my first post!"}'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "author": "507f1f77bcf86cd799439010",
    "authorName": "John Doe",
    "content": "This is my first post!",
    "likes": 0,
    "comments": [],
    "adminReplies": [],
    "createdAt": "2026-02-14T10:00:00Z"
  }
}
```

### Comment Endpoints (`/comments`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---|---|
| POST | `/comments` | Create comment | ✅ | User/Admin |
| GET | `/comments/post/:postId` | Get post comments (paginated) | ❌ | - |
| PUT | `/comments/:id` | Update comment | ✅ | Owner/Admin |
| DELETE | `/comments/:id` | Delete comment | ✅ | Owner/Admin |
| POST | `/comments/:id/like` | Like/Unlike comment | ✅ | User/Admin |

**Example Request - Create Comment:**
```bash
curl -X POST http://localhost:4002/api/v1/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"postId": "507f1f77bcf86cd799439011", "content": "Great post!"}'
```

### Admin Endpoints (`/admin`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---|---|
| POST | `/admin/reply` | Post official reply | ✅ | Admin only |
| GET | `/admin/replies/:postId` | Get admin replies for post | ❌ | - |
| PUT | `/admin/reply/:id` | Update admin reply | ✅ | Admin only |
| DELETE | `/admin/reply/:id` | Delete admin reply | ✅ | Admin only |
| GET | `/admin/moderation/posts` | Get all posts for moderation | ✅ | Admin only |

**Example Request - Post Admin Reply:**
```bash
curl -X POST http://localhost:4002/api/v1/admin/reply \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"postId": "507f1f77bcf86cd799439011", "content": "Thanks for your feedback!"}'
```

---

## Frontend API Operations

### Post Operations (`src/service/operations/postAPI.js`)

```javascript
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost
} from '@/service/operations/postAPI';

// Create post
const newPost = await createPost("My first post", token);

// Get all posts
const postsData = await getAllPosts(page, limit, token);

// Update post
const updated = await updatePost(postId, "Updated content", token);

// Delete post
const deleted = await deletePost(postId, token);

// Like post
const liked = await toggleLikePost(postId, token);
```

### Comment Operations (`src/service/operations/commentAPI.js`)

```javascript
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  toggleLikeComment
} from '@/service/operations/commentAPI';

// Create comment
const comment = await createComment(postId, "Great post!", token);

// Get comments
const comments = await getPostComments(postId, page, limit, token);

// Update comment
const updated = await updateComment(commentId, "Updated comment", token);

// Delete comment
const deleted = await deleteComment(commentId, token);

// Like comment
const liked = await toggleLikeComment(commentId, token);
```

### Admin Operations (`src/service/operations/adminAPI.js`)

```javascript
import {
  postAdminReply,
  getAdminReplies,
  updateAdminReply,
  deleteAdminReply,
  getAllPostsForModeration
} from '@/service/operations/adminAPI';

// Post official reply
const reply = await postAdminReply(postId, "Official response", token);

// Get admin replies
const replies = await getAdminReplies(postId, token);

// Update reply
const updated = await updateAdminReply(replyId, "Updated response", token);

// Delete reply
const deleted = await deleteAdminReply(replyId, token);

// Get posts for moderation
const moderationPosts = await getAllPostsForModeration(page, limit, token);
```

---

## Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["user", "admin"], default: "user"),
  createdAt: Date,
  updatedAt: Date
}
```

### Post Schema
```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: User),
  authorName: String,
  authorRole: String (enum: ["user", "admin"]),
  content: String (required, max: 5000),
  likes: Number (default: 0),
  likedBy: [ObjectId], // Array of user IDs who liked
  comments: [ObjectId], // Array of comment IDs
  adminReplies: [ObjectId], // Array of admin reply IDs
  isEnabled: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Schema
```javascript
{
  _id: ObjectId,
  post: ObjectId (ref: Post),
  author: ObjectId (ref: User),
  authorName: String,
  content: String (required, max: 2000),
  likes: Number (default: 0),
  likedBy: [ObjectId], // Array of user IDs who liked
  isEnabled: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### AdminReply Schema
```javascript
{
  _id: ObjectId,
  post: ObjectId (ref: Post),
  author: ObjectId (ref: User),
  content: String (required, max: 3000),
  isOfficial: Boolean (default: true),
  isEnabled: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication Flow

### JWT Token Structure
```
Header: {
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

### Token Payload
```javascript
{
  id: user._id,
  email: user.email,
  name: user.name,
  role: user.role,
  iat: issued_at,
  exp: expiration_time
}
```

---

## Error Responses

All API endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## Setup Instructions

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Fill in your MongoDB URI and JWT secret

# Start development server
npm run dev

# Server runs on http://localhost:4002
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
VITE_API_BASE_URL=http://localhost:4002

# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

---

## Security Features

✅ **JWT Authentication** - Secure token-based authentication
✅ **Role-Based Access Control** - User and Admin roles
✅ **Password Hashing** - bcryptjs for secure password storage
✅ **CORS Protection** - Configured to allow specific origins
✅ **Input Validation** - Server-side validation for all inputs
✅ **Authorization Middleware** - Verify user permissions before operations
✅ **Protected Routes** - Frontend route protection based on roles

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page

**Response:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPosts": 50,
    "limit": 10
  }
}
```

---

## Testing the APIs

### Using Postman or Curl

1. **Signup**
```bash
curl -X POST http://localhost:4002/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

2. **Login**
```bash
curl -X POST http://localhost:4002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

3. **Create Post** (use token from login)
```bash
curl -X POST http://localhost:4002/api/v1/posts \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"content": "My first post!"}'
```

---

## Next Steps / Deployment

- [ ] Deploy backend to Railway, Heroku, or Render
- [ ] Deploy frontend to Vercel or Netlify
- [ ] Set up production MongoDB Atlas cluster
- [ ] Configure environment variables for production
- [ ] Enable HTTPS and update CORS origins
- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Add email notifications for admin replies
- [ ] Implement post search and filtering
- [ ] Add user profile pages
- [ ] Implement real-time notifications with Socket.io

---

## Support

For issues or questions, please check the console logs and error messages for detailed debugging information.
