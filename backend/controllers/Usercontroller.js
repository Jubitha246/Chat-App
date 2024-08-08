import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import generateToken from '../generatetoken.js'; // Assuming generateToken is in the same directory

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const pic = req.file ? req.file.path : 'uploads/default_image.jpg'; // Path to uploaded image or default image

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      pic,
      role: 'user',
    });

    await newUser.save();
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        pic: newUser.pic,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Authenticate user (for login)
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Authentication successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        role: user.role,
        token: generateToken(user),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
