const User = require('../models/user');
const {generateToken} = require('../utils/auth');
const auth = require('../middleware/auth');
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ username, email, password });
        await user.save();

        // Generate a token for the new user
        const token = generateToken(user);

        return res.status(201).json({ message: 'User created successfully', token, user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token for the logged-in user
        const token = generateToken(user);

        return res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token for the logged-in user
        const token = generateToken(user);

        return res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.find();
        return res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
