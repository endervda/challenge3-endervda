const express = require('express');
const router = express.Router();
const Message = require('../../../models/api/v1/Message'); // Correct pad naar je model

// GET alle berichten
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json({
      status: "success",
      message: "GETTING messages",
      data: {
        messages: messages.map(message => ({
          user: message.user,
          message: message.text
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET één bericht op basis van ID
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    res.json({
      status: "success",
      message: "GETTING message 1",
      data: {
        message: {
          user: message.user,
          message: message.text
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST een nieuw bericht
router.post('/', async (req, res) => {
  const message = new Message({
    user: req.body.user,
    text: req.body.text
  });

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: update een bericht
router.put('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (req.body.user) message.user = req.body.user;
    if (req.body.text) message.text = req.body.text;

    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE een bericht
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    await message.remove();
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
