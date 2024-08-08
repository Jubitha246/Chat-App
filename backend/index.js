import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import User from './models/User.js';
import userRoutes from './routes/userRoute.js';
import chatRoutes from './routes/chatRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB();

const createAdminUser = async () => {
  const email = 'admin@example.com';
  const existingAdmin = await User.findOne({ email });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    const adminUser = new User({
      name: 'Admin User',
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    createAdminUser();
  })
  .catch(error => console.error('MongoDB connection error:', error));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/chats', chatRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', async (data) => {
    // Implement message sending logic here
  });

  socket.on('editMessage', async (data) => {
    // Implement message editing logic here
  });

  socket.on('deleteMessage', async (id) => {
    // Implement message deletion logic here
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Chat server running on port ${port}`));
