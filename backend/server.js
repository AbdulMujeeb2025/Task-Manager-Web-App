const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/tasks', require('./routes/tasks'));
app.use('/user', require('./routes/user'));
app.use('/projects', require('./routes/projects'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API Running' });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
