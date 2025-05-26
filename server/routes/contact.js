const express = require('express');
const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const { validateContact, validateId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Submit contact form (public)
router.post('/', validateContact, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contactData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    const contact = new Contact(contactData);
    await contact.save();

    res.status(201).json({ 
      message: 'Thank you for your message! I will get back to you soon.',
      id: contact._id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

// Get all contact messages (admin only)
router.get('/', [auth, validatePagination], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { status, search } = req.query;
    
    // Build query
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Contact.countDocuments(query);
    
    res.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contact message by ID (admin only)
router.get('/:id', [auth, validateId], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    // Mark as read if not already read
    if (!contact.isRead) {
      contact.isRead = true;
      contact.status = 'read';
      await contact.save();
    }

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact message status (admin only)
router.patch('/:id/status', [auth, validateId], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'read' && { isRead: true })
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add reply to contact message (admin only)
router.post('/:id/reply', [auth, validateId], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ message: 'Reply message must be at least 10 characters' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        reply: {
          message: message.trim(),
          sentAt: new Date()
        },
        status: 'replied'
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact message (admin only)
router.delete('/:id', [auth, validateId], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
