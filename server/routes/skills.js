// server/routes/skills.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator'); // For input validation
const auth = require('../middleware/auth'); // Your authentication middleware
// CORRECTED IMPORT: Use object destructuring for 'validation'
const { validation } = require('../middleware/validation'); // Your validation error handler middleware
const Skill = require('../models/Skill'); // Your Skill Mongoose model

// @route   GET /api/skills
// @desc    Get all skills (with optional category filter and sorting)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, sort = 'name' } = req.query; // Default sort by 'name'

        let query = {};
        if (category) {
            // Case-insensitive search for category
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        // Fetch skills, sort by the specified field, and return
        const skills = await Skill.find(query).sort({ [sort]: 1 }); // 1 for ascending order

        res.json(skills);
    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({ message: 'Server error while fetching skills' });
    }
});

// @route   GET /api/skills/categories
// @desc    Get all unique skill categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        // Use .distinct() to get all unique values for the 'category' field
        const categories = await Skill.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error while fetching categories' });
    }
});

// @route   GET /api/skills/:id
// @desc    Get a single skill by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        res.json(skill);
    } catch (error) {
        console.error('Get skill by ID error:', error);
        // If the ID format is invalid (e.g., not a valid MongoDB ObjectId)
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Skill not found with provided ID' });
        }
        res.status(500).json({ message: 'Server error while fetching skill by ID' });
    }
});

// @route   POST /api/skills
// @desc    Create a new skill
// @access  Private (Admin only)
router.post(
    '/',
    [
        auth, // Ensure user is authenticated
        // Validation checks for request body
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('category').trim().notEmpty().withMessage('Category is required'),
        body('level')
            .isInt({ min: 1, max: 100 })
            .withMessage('Level must be an integer between 1 and 100'),
        body('icon').optional().trim(), // Optional field
        body('description').optional().trim(), // Optional field
        validation, // Middleware to handle validation errors
    ],
    async (req, res) => {
        try {
            // Check if the authenticated user has 'admin' role
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Admin access required to create skills' });
            }

            const { name, category, level, icon, description } = req.body;

            // Check if a skill with the same name and category already exists (case-insensitive)
            const existingSkill = await Skill.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                category: { $regex: new RegExp(`^${category}$`, 'i') }
            });

            if (existingSkill) {
                return res.status(400).json({ message: 'Skill with this name already exists in this category' });
            }

            // Create a new Skill instance
            const skill = new Skill({
                name,
                category,
                level,
                icon,
                description,
            });

            // Save the new skill to the database
            await skill.save();
            res.status(201).json(skill); // Respond with the created skill and 201 status
        } catch (error) {
            console.error('Create skill error:', error);
            res.status(500).json({ message: 'Server error while creating skill' });
        }
    }
);

// @route   PUT /api/skills/:id
// @desc    Update an existing skill by ID
// @access  Private (Admin only)
router.put(
    '/:id',
    [
        auth, // Ensure user is authenticated
        // Validation rules for optional fields during update
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
        body('level')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Level must be an integer between 1 and 100'),
        body('icon').optional().trim(),
        body('description').optional().trim(),
        validation, // Middleware to handle validation errors
    ],
    async (req, res) => {
        try {
            // Check if the authenticated user has 'admin' role
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Admin access required to update skills' });
            }

            const { name, category, level, icon, description } = req.body;

            let skill = await Skill.findById(req.params.id);

            if (!skill) {
                return res.status(404).json({ message: 'Skill not found' });
            }

            // If name or category is being changed, check for duplicates (excluding the current skill)
            if (name !== undefined || category !== undefined) {
                const checkName = name || skill.name;
                const checkCategory = category || skill.category;

                const existingSkill = await Skill.findOne({
                    _id: { $ne: req.params.id }, // Exclude the current skill being updated
                    name: { $regex: new RegExp(`^${checkName}$`, 'i') },
                    category: { $regex: new RegExp(`^${checkCategory}$`, 'i') }
                });

                if (existingSkill) {
                    return res.status(400).json({ message: 'Another skill with this name exists in this category' });
                }
            }

            // Update skill fields only if they are provided in the request body
            if (name !== undefined) skill.name = name;
            if (category !== undefined) skill.category = category;
            if (level !== undefined) skill.level = level;
            if (icon !== undefined) skill.icon = icon;
            if (description !== undefined) skill.description = description;

            skill.updatedAt = Date.now(); // Update the timestamp

            await skill.save(); // Save the updated skill
            res.json(skill); // Respond with the updated skill
        } catch (error) {
            console.error('Update skill error:', error);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ message: 'Skill not found with provided ID' });
            }
            res.status(500).json({ message: 'Server error while updating skill' });
        }
    }
);

// @route   DELETE /api/skills/:id
// @desc    Delete a skill by ID
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if the authenticated user has 'admin' role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required to delete skills' });
        }

        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Delete the skill from the database
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Delete skill error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Skill not found with provided ID' });
        }
        res.status(500).json({ message: 'Server error while deleting skill' });
    }
});

// @route   POST /api/skills/bulk
// @desc    Create multiple skills at once
// @access  Private (Admin only)
router.post('/bulk', auth, async (req, res) => {
    try {
        // Check if the authenticated user has 'admin' role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required for bulk skill creation' });
        }

        const { skills } = req.body;

        // Basic validation for the input array
        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: 'An array of skills is required for bulk creation' });
        }

        // Validate each skill object within the array
        for (const skill of skills) {
            if (!skill.name || !skill.category || !skill.level) {
                return res.status(400).json({
                    message: 'Each skill in the bulk upload must have a name, category, and level',
                    invalidSkill: skill // Include the problematic skill for debugging
                });
            }
            if (skill.level < 1 || skill.level > 100) {
                return res.status(400).json({
                    message: 'Skill level must be between 1 and 100',
                    invalidSkill: skill
                });
            }
            // Add more validation if needed, e.g., trim strings
            if (typeof skill.name === 'string') skill.name = skill.name.trim();
            if (typeof skill.category === 'string') skill.category = skill.category.trim();
            if (typeof skill.icon === 'string') skill.icon = skill.icon.trim();
            if (typeof skill.description === 'string') skill.description = skill.description.trim();
        }

        // Use insertMany for efficient bulk insertion
        const createdSkills = await Skill.insertMany(skills, { ordered: false }); // ordered: false allows some insertions to succeed even if others fail due to unique constraints

        res.status(201).json(createdSkills); // Respond with the newly created skills
    } catch (error) {
        console.error('Bulk create skills error:', error);
        // Handle duplicate key error (code 11000) for MongoDB
        if (error.code === 11000) {
            return res.status(400).json({ message: 'One or more skills in the bulk request already exist', details: error.message });
        }
        res.status(500).json({ message: 'Server error during bulk skill creation' });
    }
});

module.exports = router; // Export the router instance for use in your main server.js
