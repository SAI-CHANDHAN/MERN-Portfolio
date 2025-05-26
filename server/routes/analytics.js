const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const User = require('../models/User');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private (Admin only)
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const [
      totalProjects,
      totalBlogs,
      totalContacts,
      totalUsers,
      recentProjects,
      recentBlogs,
      recentContacts,
      projectStats,
      blogStats,
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      User.countDocuments(),
      Project.find().sort({ createdAt: -1 }).limit(5).select('title createdAt'),
      Blog.find().sort({ createdAt: -1 }).limit(5).select('title createdAt'),
      Contact.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      getProjectStats(),
      getBlogStats(),
    ]);

    res.json({
      overview: {
        totalProjects,
        totalBlogs,
        totalContacts,
        totalUsers,
      },
      recent: {
        projects: recentProjects,
        blogs: recentBlogs,
        contacts: recentContacts,
      },
      stats: {
        projects: projectStats,
        blogs: blogStats,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/projects
// @desc    Get project analytics
// @access  Private (Admin only)
router.get('/projects', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const projectStats = await getDetailedProjectStats();
    res.json(projectStats);
  } catch (error) {
    console.error('Project analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/blogs
// @desc    Get blog analytics
// @access  Private (Admin only)
router.get('/blogs', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const blogStats = await getDetailedBlogStats();
    res.json(blogStats);
  } catch (error) {
    console.error('Blog analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/contacts
// @desc    Get contact analytics
// @access  Private (Admin only)
router.get('/contacts', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const contactStats = await getContactStats();
    res.json(contactStats);
  } catch (error) {
    console.error('Contact analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper Functions
async function getProjectStats() {
  const stats = await Project.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return stats.map(stat => ({
    month: monthNames[stat._id - 1],
    count: stat.count,
  }));
}

async function getBlogStats() {
  const stats = await Blog.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return stats.map(stat => ({
    month: monthNames[stat._id - 1],
    count: stat.count,
  }));
}

async function getDetailedProjectStats() {
  const [totalProjects, projectsByStatus, projectsByTech] = await Promise.all([
    Project.countDocuments(),
    Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
    Project.aggregate([
      { $unwind: '$technologies' },
      {
        $group: {
          _id: '$technologies',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  return {
    total: totalProjects,
    byStatus: projectsByStatus,
    byTechnology: projectsByTech,
  };
}

async function getDetailedBlogStats() {
  const [totalBlogs, blogsByCategory, recentBlogs] = await Promise.all([
    Blog.countDocuments(),
    Blog.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]),
    Blog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title createdAt category')
  ]);

  return {
    total: totalBlogs,
    byCategory: blogsByCategory,
    recent: recentBlogs,
  };
}

async function getContactStats() {
  const [totalContacts, contactsByMonth, recentContacts] = await Promise.all([
    Contact.countDocuments(),
    Contact.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]),
    Contact.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email subject createdAt')
  ]);

  return {
    total: totalContacts,
    byMonth: contactsByMonth,
    recent: recentContacts,
  };
}

module.exports = router;