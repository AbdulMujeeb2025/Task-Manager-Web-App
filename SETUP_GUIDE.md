# Task Manager Web App

Ek complete Task Manager web application jisme login, signup aur task management features hain.

## Features

✅ **User Authentication**
- Signup: Naya account banao
- Login: Apna account se login karo
- JWT Token based authentication

✅ **Auto Signup Modal**
- App load hote hi 5-7 seconds baad signup modal automatically aata hai
- Naye users ko directly signup modal se account bana sakte hain

✅ **Task Management**
- Tasks add karo
- Tasks delete karo
- Apne tasks ko dekho dashboard pe
- User ke sath task linked hota hai (har user ke apne tasks hain)

## Project Structure

```
backend/          - Node.js + Express server
├── config/       - Database configuration
├── models/       - MongoDB schemas (User, Task)
├── middleware/   - JWT authentication middleware
├── routes/       - API routes (auth, tasks)
└── server.js     - Main server file

frontend/         - React + Vite application
├── src/
│   ├── pages/    - Login, Signup, Dashboard pages
│   ├── components/ - Reusable components (SignupModal)
│   ├── styles/   - CSS files
│   └── App.jsx   - Main app component
```

## Installation aur Setup

### Prerequisites
- Node.js installed ho
- MongoDB local machine pe chal raha ho (default: mongodb://localhost:27017)

### Backend Setup

```bash
cd backend
npm install
```

**Environment Variables (.env file already created):**
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**Start Backend Server:**
```bash
npm start
```
Server `http://localhost:4000` pe chalega

### Frontend Setup

```bash
cd frontend
npm install
```

**Start Frontend:**
```bash
npm run dev
```
App `http://localhost:5173` pe khul jayega

## How It Works

1. **App Load** → User localhost:5173 pe aata hai
2. **5-7 Seconds Wait** → Automatically signup modal aata hai
3. **User Account Create** → Name, Email, Password daal kar account banao
4. **Dashboard Access** → Login success ke baad task management dashboard dekho
5. **Add/Delete Tasks** → Apne tasks ko manage karo
6. **Logout** → Jab logout karo, dobara login page aata hai

## API Endpoints

### Authentication
- `POST /auth/register` - Naya user register karo
- `POST /auth/login` - User login karo

### Tasks (require Bearer token in Authorization header)
- `GET /tasks` - Sare tasks get karo
- `POST /tasks` - New task create karo
- `PUT /tasks/:id` - Task update karo
- `DELETE /tasks/:id` - Task delete karo

## Important Notes

⚠️ **Make sure MongoDB is running** on your machine
- Windows: `mongod` command terminal se start karo
- Mac: `brew services start mongodb-community`
- Linux: `sudo service mongod start`

⚠️ **JWT Secret Change**: Production main JWT_SECRET को change karna bhool mat jo

✅ **Folder structure already complete hai** - sauf .env file jo creation ke baad auto ban gayi hai

## Next Steps (Future Development)

- [ ] Task completion toggle
- [ ] Task categories/tags
- [ ] Task due dates
- [ ] Task filtering
- [ ] User profile management
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Dark mode

---

**Happy Task Managing!** 🚀
