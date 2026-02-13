# 🚀 QUICK START GUIDE

Get your MERN Community Platform running in **5 minutes**!

---

## ⚡ Prerequisites Check

- ✅ Node.js installed? (v18+)
- ✅ MongoDB Atlas account created?
- ✅ Git installed?

If not, install these first!

---

## 📋 Step-by-Step Setup

### 1️⃣ Clone & Setup (1 minute)

```bash
# Clone the repository
git clone <your-repo-url>
cd newway

# Navigate to backend
cd server
npm install
```

### 2️⃣ Configure Backend (1 minute)

Create `.env` file in `server` folder:

```env
MONGODB_URI=mongodb+srv://sufyaan:em8cFfVJ2YYnqlMx@cluster-skillhouse.qu69pbc.mongodb.net/newways?retryWrites=true&w=majority
PORT=4002
JWT_SECRET=your_super_secret_key_change_this
TOKEN_EXPIRY=7d
```

Or copy from `.env.example` and fill in values.

### 3️⃣ Start Backend (30 seconds)

```bash
npm run dev
```

**You should see:**
```
Server is running on port 4002
MongoDB connected successfully
```

### 4️⃣ Configure Frontend (1 minute)

Open new terminal:

```bash
cd frontend
npm install

# Create .env.local file
echo "VITE_API_BASE_URL=http://localhost:4002" > .env.local
```

### 5️⃣ Start Frontend (30 seconds)

```bash
npm run dev
```

**You should see:**
```
Local:   http://localhost:5173/
```

---

## ✅ Application is Running!

### Open in Browser
```
http://localhost:5173
```

---

## 🧪 Test the Application

### 1. Sign Up
- Click "Sign Up" button
- Fill form (name, email, password)
- Click "Create Account"

### 2. Login
- Click "Login"
- Enter email & password
- Click "Sign In"

### 3. Create Post
- Type in "What's on your mind?" box
- Click "Post"
- See your post appear!

### 4. Comment
- Click on any post
- Type comment
- Click "Comment"

### 5. Like
- Click heart icon on post or comment
- See like count increase

### 6. Admin Features (Optional)
- Logout
- Create/Login new user with admin role
- Access `/admin/dashboard`
- Post official replies

---

## 📡 API Testing (Postman/Curl)

### Get Posts
```bash
curl http://localhost:4002/api/v1/posts
```

### Create Post (need token)
```bash
curl -X POST http://localhost:4002/api/v1/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello world!"}'
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **MongoDB connection error** | Check MONGODB_URI in .env, ensure IP is whitelisted |
| **CORS error** | Both servers running? Check URLs in config |
| **Blank page** | Open DevTools (F12), check console for errors |
| **Port 4002 in use** | Change PORT in .env or kill process using that port |
| **Can't login after signup** | Check MongoDB connection, check browser console |

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `server/.env` | Backend config (MongoDB, JWT, Port) |
| `frontend/.env.local` | Frontend config (API URL) |
| `API_DOCUMENTATION.md` | Complete API reference |
| `README.md` | Full project documentation |
| `PROJECT_COMPLETION_SUMMARY.md` | Feature checklist |

---

## 🎯 What's Included

✅ **Posts** - Create, edit, delete, like  
✅ **Comments** - Comment on posts, manage  
✅ **Admin Replies** - Official moderated responses  
✅ **Authentication** - Signup, login, logout  
✅ **Dashboards** - User feed and admin panel  
✅ **Responsive UI** - Works on mobile & desktop  
✅ **Full API** - All endpoints documented  

---

## 🔗 Useful Links

- **Frontend**: http://localhost:5173
- **API Base**: http://localhost:4002
- **API Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Full README**: [README.md](./README.md)
- **MongoDB**: https://www.mongodb.com/cloud/atlas

---

## 💡 Pro Tips

1. **Keep both terminals open** - Backend and Frontend both need to run
2. **Check console logs** - If something breaks, console shows why
3. **Use Postman** - Test APIs on http://localhost:4002/api/v1
4. **Create dummy account** - Use "admin@test.com" to test features
5. **Check DevTools** - F12 in browser to debug frontend issues

---

## 🎓 Next: Full Documentation

When you're ready, check:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - All endpoints
- [README.md](./README.md) - Full features
- [PROJECT_COMPLETION_SUMMARY.md](./PROJECT_COMPLETION_SUMMARY.md) - Requirements checklist

---

## 🚀 Deployment Checklist

When ready to go live:
- [ ] Update `.env` with production MongoDB URI
- [ ] Change JWT_SECRET to strong random string
- [ ] Update CORS origins for production domains
- [ ] Set `NODE_ENV=production`
- [ ] Deploy backend to Heroku/Railway
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Test all APIs on production

---

## ❓ Still Stuck?

1. **Check console** (F12 in browser)
2. **Check terminal logs** (where npm run dev runs)
3. **Read API_DOCUMENTATION.md**
4. **Verify .env files** are correct
5. **Restart servers** if nothing works

---

**Happy Coding! 🎉**

*Any issues? Check the detailed documentation files.*
