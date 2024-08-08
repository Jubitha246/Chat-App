import Chat from '../models/Chat.js';
// Create a new chat
export const createChat = async (req, res) => {
  try {
    const { isGroupChat, users, chatName } = req.body;
    const newChat = new Chat({ isGroupChat, users, chatName });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// Get all chats for a user
export const getChatsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ users: userId });
    if (!chats.length) {
      return res.status(404).json({ message: 'No chats found' });
    }
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// Add more chat-related methods if needed (e.g., get chat by ID, update chat, delete chat)
