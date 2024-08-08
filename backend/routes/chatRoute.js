import express from 'express';
import { createChat, getChatsForUser } from '../controllers/Chatcontroller.js';

const router = express.Router();

// Route to create a new chat
router.post('/', createChat);

// Route to get all chats for a user
router.get('/:userId', getChatsForUser);

// Additional chat-related routes can be added here if needed

export default router;
