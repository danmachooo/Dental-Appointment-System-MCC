const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Send a new message
router.post('/', messageController.sendMessage);

// Get all messages for a user
router.get('/user/:userId', messageController.getUserMessages);

module.exports = router;