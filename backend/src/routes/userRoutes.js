const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Your JWT auth middleware
const User = require('../models/user');
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/createUser', userController.createUser);
router.post('/login', userController.login);
router.post('/loginWithEmail', userController.loginWithEmail);
router.get('/getUser', userController.getUser);
module.exports = router;
