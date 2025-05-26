const express = require('express');
const { validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const { validateBlog, validateId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Get all published blogs (public)
router.get('/', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { category, tag, search } = req.query;
    
    // Build query
    let query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .select('-content') // Exclude full content for list view
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(query);
    
    res.json({
      blogs,
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

// Get recent blogs (public)
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const blogs = await Blog.find({ isPublished: true })
      .populate('author', 'name avatar')
      .select('title excerpt slug publishedAt readTime featuredImage')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog by ID or slug (public)
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is MongoDB ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };
    query.isPublished = true;

    const blog = await Blog.findOne(query)
      .populate('author', 'name avatar bio')
      .lean();
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment views
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog post (admin only)
router.post('/', [auth, ...validateBlog], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blogData = {
      ...req.body,
      author: req.user.id
    };

    const blog = new Blog(blogData);
    await blog.save();
    
    await blog.populate('author', 'name avatar');

    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Blog post with this title already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog post (admin only)
router.put('/:id', [auth, validateId, ...validateBlog], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Blog post with this title already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog post (admin only)
router.delete('/:id', [auth, validateId], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all blogs for admin
router.get('/admin/all', auth, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { isPublished: true });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog tags
router.get('/meta/tags', async (req, res) => {
  try {
    const tags = await Blog.distinct('tags', { isPublished: true });
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;