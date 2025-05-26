// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

// Load environment variables (ensure process.env.JWT_SECRET is set)
require('dotenv').config({ path: '../.env' }); // Adjust path if .env is not in server root

/**
 * @function auth
 * @description Middleware to verify JWT token and attach user data to req.
 * Also checks if the user exists and is active.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const auth = async (req, res, next) => {
    try {
        // Get token from the 'Authorization' header (e.g., "Bearer YOUR_TOKEN")
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // If no token is provided, deny access
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify the token using the secret key
        // Make sure process.env.JWT_SECRET is correctly configured in your .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the database based on the decoded user ID
        // .select('-password') excludes the password hash from the retrieved user object
        const user = await User.findById(decoded.user.id).select('-password');

        // If user does not exist or is not active, consider the token invalid
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Token is not valid or user is inactive' });
        }

        // Attach the decoded user object (from the token) to the request
        // This makes user data available in subsequent route handlers (e.g., req.user.id, req.user.role)
        req.user = {
            id: user._id, // Use user._id from DB to ensure it's correct
            role: user.role // Get role from DB to ensure it's current
        };

        // Pass control to the next middleware or route handler
        next();

    } catch (error) {
        // Log the detailed error for debugging
        console.error('Auth middleware error:', error.message);

        // Differentiate between common JWT errors for more specific feedback
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Generic unauthorized message for other errors
        res.status(401).json({ message: 'Authorization denied' });
    }
};

module.exports = auth; // Export the middleware function directly