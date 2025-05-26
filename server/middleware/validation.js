// server/middleware/validation.js
const { body, param, query, validationResult } = require('express-validator');

// --- Reusable Validation Chains ---

// General validation error handler middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation for Blog Post creation/update
const validateBlog = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required').isLowercase().withMessage('Slug must be lowercase'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('tags.*').isString().trim().notEmpty().withMessage('Each tag must be a non-empty string'),
    body('featuredImage').optional().isURL().withMessage('Featured image must be a valid URL'),
    body('readTime').isInt({ min: 1 }).withMessage('Read time must be a positive integer'),
    body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
    body('metaDescription').optional().trim(),
    body('metaKeywords').optional().trim(),
    handleValidationErrors // Apply the error handler after all validation checks
];

// Validation for Contact Form submission
const validateContact = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
    handleValidationErrors // Apply the error handler after all validation checks
];

// Validation for Project creation/update
const validateProject = [ // THIS MUST BE AN ARRAY
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('technologies').isArray({ min: 1 }).withMessage('Technologies must be an array with at least one item'),
    body('technologies.*').isString().trim().notEmpty().withMessage('Each technology must be a non-empty string'),
    body('githubLink').optional().isURL().withMessage('GitHub link must be a valid URL'),
    body('liveLink').optional().isURL().withMessage('Live link must be a valid URL'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('status').optional().isIn(['planning', 'development', 'completed', 'deployed']).withMessage('Invalid project status'),
    handleValidationErrors // Apply the error handler after all validation checks
];


// Validation for ID parameters (e.g., in /api/blogs/:id, /api/contacts/:id, /api/projects/:id)
const validateId = [
    param('id').isMongoId().withMessage('Invalid ID format'),
    handleValidationErrors
];

// Validation for pagination query parameters
const validatePagination = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    handleValidationErrors
];

// --- Export all validation middleware and helper functions ---
module.exports = {
    validation: handleValidationErrors, // This is the general error handler

    // Export specific validation chains for use in routes
    validateBlog,
    validateContact,
    validateProject,
    validateId,
    validatePagination
};
