const { Message, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

const messageController = {
  // Send a new message
  async sendMessage(req, res) {
    try {
      const { content, senderId, receiverId } = req.body;

      // Basic validation
      if (!content || !senderId || !receiverId) {
        return res.status(400).json({ error: 'Content, sender, and receiver are required.' });
      }

      // Optional: Sanitize message content to prevent XSS
      const sanitizedContent = content.replace(/<[^>]*>/g, ''); // Simple XSS protection (can be enhanced)

      const message = await Message.create({ 
        content: sanitizedContent, 
        senderId, 
        receiverId 
      });

      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Get all messages for a user with pagination
  async getUserMessages(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 messages per page

      const offset = (page - 1) * limit;

      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        include: [
          { model: User, as: 'Sender', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'Receiver', attributes: ['firstName', 'lastName'] }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      // Format the message creation dates to a readable format
      const formattedMessages = messages.map(message => ({
        ...message.toJSON(),
        createdAt: moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss') // Format datetime
      }));

      res.json(formattedMessages);
    } catch (error) {
      console.error('Error fetching user messages:', error);
      res.status(500).json({ error: 'Unable to retrieve messages at this time.' });
    }
  }
};

module.exports = messageController;
