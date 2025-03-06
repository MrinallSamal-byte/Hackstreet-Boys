const bcrypt = require('bcrypt');
const db = require('../config/dbConfig');
const { createUser, findUserByEmail, searchUsersByUsername, updateUserById, findUserByUsername, updateUserInDb, checkUserRating, addUserRating } = require('../models/userModel');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role, phone, dob, description } = req.body;
        const [existingUser] = await findUserByEmail(email);
        if (existingUser.length > 0) {
            const isMatch = await bcrypt.compare(password, existingUser[0].password);
            if (isMatch) {
                req.session.user = existingUser[0]; // Save user session
                return res.status(200).json({ message: 'User logged in successfully', redirect: '/hackathons' });
            } else {
                return res.status(400).json({ message: 'Email already exists but password is incorrect' });
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(username, email, hashedPassword, role, phone, dob, description);
        const [newUser] = await findUserByEmail(email);
        req.session.user = newUser[0]; // Save user session
        res.status(201).json({ message: 'User registered successfully', redirect: '/hackathons' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [user] = await findUserByEmail(email);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        if (user[0].email === 'samalmrinal5@gmail.com') {
            return res.json({ redirect: 'new-hackathon.html' });
        }
        req.session.user = user[0]; // Save user session
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const loggedInUserId = req.session.user.id;
        const [results] = await db.promise().query('SELECT id, username, role, likes, dislikes FROM users WHERE id != ?', [loggedInUserId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const [results] = await searchUsersByUsername(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
    }
};

exports.updateUsername = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { username } = req.body;
        await updateUserById(userId, { username });
        req.session.user.username = username; // Update session
        res.status(200).json({ message: 'Username updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.rateUser = async (req, res) => {
    try {
        const { username, rating } = req.body;
        const userId = req.session.user.id;
        const [user] = await findUserByUsername(username);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const targetUserId = user[0].id;

        // Check if the user has already rated this user
        const [existingRating] = await checkUserRating(userId, targetUserId);
        if (existingRating.length > 0) {
            return res.status(400).json({ message: 'You have already rated this user' });
        }

        // Add the rating
        await addUserRating(userId, targetUserId, rating);
        if (rating === 'like') {
            await db.promise().query('UPDATE users SET likes = likes + 1 WHERE id = ?', [targetUserId]);
        } else if (rating === 'dislike') {
            await db.promise().query('UPDATE users SET dislikes = dislikes + 1 WHERE id = ?', [targetUserId]);
        }
        res.status(200).json({ message: `User ${rating}d successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    const userId = req.session.user.id; // Use session user ID
    const { username, email, dob, phone, institution } = req.body;

    try {
        const [result] = await updateUserInDb(userId, { username, email, dob, phone, institution });
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Profile update failed' });
        }
        req.session.user = { ...req.session.user, username, email, dob, phone, institution }; // Update session
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};