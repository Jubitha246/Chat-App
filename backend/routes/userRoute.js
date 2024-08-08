import express from 'express';
import { createUser, getUserById, authUser } from '../controllers/Usercontroller.js';

const router = express.Router();

// Route to create a new user
router.post('/', createUser);

// Route to get a user by ID
router.get('/:id', getUserById);

// Route to authenticate a user (login)
router.post('/login', authUser);

export default router;
