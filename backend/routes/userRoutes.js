const express = require('express');
const { registerUser, loginUser, searchUsers, getAllUsers, updateUsername, rateUser, updateUserProfile } = require('../controllers/userController');
const { body, validationResult } = require('express-validator');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', 
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Enter a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    registerUser
);

router.post('/login', 
    [
        body('email').isEmail().withMessage('Enter a valid email address'),
        body('password').exists().withMessage('Password is required')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    loginUser
);

router.get('/search', isAuthenticated, searchUsers);

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('session');
        res.json({ message: 'Logout successful' });
    });
});

router.get('/users', isAuthenticated, getAllUsers);

router.get('/check-session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ isLoggedIn: true, user: req.session.user });
    } else {
        res.json({ isLoggedIn: false });
    }
});

router.post('/update-username', isAuthenticated, 
    [
        body('username').notEmpty().withMessage('Username is required')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    updateUsername
);

router.post('/rate-user', isAuthenticated, 
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('rating').isIn(['like', 'dislike']).withMessage('Rating must be either like or dislike')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    rateUser
);

router.put('/profile', 
    isAuthenticated,
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('dob').optional().isISO8601().toDate().withMessage('Valid date of birth is required'),
        body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
        body('institution').optional().notEmpty().withMessage('Institution name is required')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    updateUserProfile
);

module.exports = router;