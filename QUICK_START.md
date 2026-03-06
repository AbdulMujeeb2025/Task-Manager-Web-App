# 🚀 Task Manager Web App - Quick Start

## ✅ Completed Setup

### Backend (Node.js + Express + MongoDB)
```
✓ server.js - Express server configured with CORS and JSON middleware
✓ .env - Environment variables configured
✓ User Model - With password hashing using bcryptjs
✓ Task Model - With user reference
✓ Auth Routes - Register and Login endpoints
✓ Task Routes - CRUD operations for tasks
✓ Auth Middleware - JWT token verification
✓ Database Config - MongoDB connection setup
```

### Frontend (React + Vite)
```
✓ App.jsx - Main component with routing logic
✓ LoginPage.jsx - User login form
✓ SignupPage.jsx - User signup form
✓ Dashboard.jsx - Task management dashboard
✓ SignupModal.jsx - Auto popup after 5-7 seconds
✓ CSS Styling - Professional gradient design
✓ State Management - Using React hooks
```

## 🎯 Features Implemented

### 1. Authentication System
- **Signup**: Create new account with name, email, password
- **Login**: Login with email and password
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcryptjs for secure password storage

### 2. Auto Signup Modal
- Shows automatically after **5-7 seconds** when app loads
- Perfect for new users to sign up immediately
- Can be closed and accessed from login page

### 3. Task Management
- **Add Tasks**: Create new tasks easily
- **View Tasks**: See all your tasks in dashboard
- **Delete Tasks**: Remove tasks you no longer need
- **User-Specific**: Each user only sees their own tasks

### 4. Professional UI
- Beautiful gradient design (Purple theme)
- Responsive layout
- Smooth animations
- Error handling and loading states

## 🏃 How to Run

### Step 1: Start MongoDB
```powershell
# Windows - in PowerShell
mongod
```

### Step 2: Start Backend Server
```powershell
cd backend
npm start
# Server will run on http://localhost:4000
```

### Step 3: Start Frontend Server (in new terminal)
```powershell
cd frontend
npm run dev
# App will open at http://localhost:5173
```

## 👤 Test the App

1. **Open** `http://localhost:5173` in browser
2. **Wait** 5-7 seconds
3. **See** Signup modal automatically appear
4. **Enter** your details:
   - Name: Aapka naam
   - Email: valid@email.com
   - Password: Koi bhi strong password
5. **Click** "Account Banao" button
6. **Access** Dashboard and start adding tasks!

## 📁 File Structure

```
backend/
├── config/db.js              (MongoDB connection)
├── middleware/auth.js        (JWT verification)
├── models/
│   ├── Task.js              (Task schema)
│   └── User.js              (User schema with password hashing)
├── routes/
│   ├── auth.js              (Login & Register routes)
│   └── tasks.js             (CRUD tasks routes)
├── server.js                (Main server)
├── package.json             (Dependencies)
└── .env                     (Environment variables)

frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx    (Login form)
│   │   ├── SignupPage.jsx   (Signup form)
│   │   └── Dashboard.jsx    (Task management)
│   ├── components/
│   │   └── SignupModal.jsx  (Auto popup)
│   ├── styles/
│   │   ├── AuthPages.css    (Login/Signup styling)
│   │   ├── SignupModal.css  (Modal styling)
│   │   └── Dashboard.css    (Dashboard styling)
│   ├── App.jsx              (Main component)
│   └── main.jsx             (Entry point)
├── package.json             (Dependencies)
└── vite.config.js           (Vite configuration)
```

## 🔐 Security Notes

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens expire in 1 day
- Token stored in localStorage for client-side
- Protected routes verify JWT token

## 📝 Environment Variables

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

## 🎨 Design Highlights

- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Font**: Segoe UI (System font)
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Works on mobile and desktop
- **Accessibility**: Proper labels and error messages

## 🚨 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running (`mongod` command)
- Check if `mongodb://localhost:27017` is accessible

### Port Already in Use
- Backend default: 4000 (change in .env if needed)
- Frontend default: 5173 (Vite will auto-increment if in use)

### CORS Error
- Backend is already configured with CORS
- Check if both servers are running

## 📝 Todo List (Future Features)

- [ ] Mark tasks as complete/incomplete
- [ ] Edit existing tasks
- [ ] Add task categories
- [ ] Add due dates
- [ ] Search and filter tasks
- [ ] User profile page
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Dark mode toggle

---

**Now you have a fully functional Task Manager app! 🎉**

Koi bhi issue ho to check karo:
1. MongoDB running hai?
2. Backend server running hai?
3. Frontend server running hai?
4. Terminal errors dekho

Happy coding! 🚀
