const express = require('express');
const { getHackathons, getHackathon, getRegistrations, createHackathon, registerForHackathon, deleteHackathon, updateHackathon, checkRegistration } = require('../controllers/hackathonController');
const { body, validationResult } = require('express-validator');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/hackathons', isAuthenticated, getHackathons);
router.get('/hackathons/:id', isAuthenticated, getHackathon);
router.get('/hackathons/:hackathonId/registrations', isAuthenticated, getRegistrations);
router.post('/hackathons', 
    isAuthenticated,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('date').isDate().withMessage('Valid date is required'),
        body('mode').notEmpty().withMessage('Mode is required'),
        body('location').if(body('mode').equals('offline')).notEmpty().withMessage('Location is required for offline mode'),
        body('description').notEmpty().withMessage('Description is required'),
        body('ageLimit').isInt({ min: 0 }).withMessage('Valid age limit is required')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    createHackathon
);
router.post('/register-hackathon', 
    isAuthenticated, 
    [
        body('hackathonId').isInt().withMessage('Hackathon ID must be an integer')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    registerForHackathon
);
router.put('/hackathons/:id', 
    isAuthenticated,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('date').isDate().withMessage('Valid date is required'),
        body('mode').notEmpty().withMessage('Mode is required'),
        body('location').if(body('mode').equals('offline')).notEmpty().withMessage('Location is required for offline mode'),
        body('description').notEmpty().withMessage('Description is required'),
        body('ageLimit').isInt({ min: 0 }).withMessage('Valid age limit is required')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    updateHackathon
);
router.delete('/hackathons/:id', isAuthenticated, deleteHackathon);
router.get('/check-registration', isAuthenticated, checkRegistration);

module.exports = router;
