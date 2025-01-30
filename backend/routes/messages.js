const express = require('express');
const router = express.Router();
const Message = require('/home/rguktongole/Desktop/ideanexus/backend/models/message.js');
const authenticateUser = require('/home/rguktongole/Desktop/ideanexus/backend/middlewear/authmiddleware.js');

// Get unread messages count
router.get('/api/messages/unread', authenticateUser, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({ message: 'Error fetching unread messages' });
  }
});

// Get all messages
router.get('/api/messages', authenticateUser, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
    .populate('sender', 'username profilePicture')
    .populate('receiver', 'username profilePicture')
    .sort({ createdAt: -1 });

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a new message
router.post('/api/messages', authenticateUser, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture');

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Mark message as read
router.patch('/api/messages/:messageId/read', authenticateUser, async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      {
        _id: req.params.messageId,
        receiver: req.user._id
      },
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Error updating message' });
  }
});

module.exports = router; 