// utils/auth.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET, // Use a secret key from environment variables
        { expiresIn: '1h' } // Token expires in 1 hour
    );
};

module.exports = { generateToken };