const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// ...existing code...

router.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ...existing code...

router.put('/update-profile', async (req, res) => {
    const { userId, name, description, dob, phone } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (dob && user.dob_updates >= 2) {
            return res.status(400).json({ message: 'DOB can only be updated twice' });
        }

        user.username = name || user.username;
        user.description = description || user.description;
        user.phone = phone || user.phone;
        if (dob) {
            user.dob = dob;
            user.dob_updates += 1;
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ...existing code...

module.exports = router;
