const { getAllHackathons, getHackathonById, getRegistrationsByHackathonId, createNewHackathon, registerUserForHackathon, checkUserRegistration, deleteHackathonById, updateHackathonById } = require('../models/hackathonModel');

exports.getHackathons = async (req, res) => {
    try {
        const [hackathons] = await getAllHackathons();
        res.json(hackathons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        const [hackathon] = await getHackathonById(id);
        if (hackathon.length === 0) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }
        res.json(hackathon[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRegistrations = async (req, res) => {
    try {
        const { hackathonId } = req.params;
        const [registrations] = await getRegistrationsByHackathonId(hackathonId);
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createHackathon = async (req, res) => {
    try {
        const { name, date, location, description, ageLimit } = req.body;
        await createNewHackathon(name, date, location, description, ageLimit);
        res.status(201).json({ message: 'Hackathon created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.registerForHackathon = async (req, res) => {
    const { hackathonId } = req.body;
    const userId = req.session.user.id; // Use session user ID

    try {
        const [existingRegistration] = await checkUserRegistration(userId, hackathonId);
        if (existingRegistration.length > 0) {
            return res.status(400).json({ message: 'User already registered for this hackathon' });
        }

        await registerUserForHackathon(hackathonId, userId);
        res.status(200).json({ message: 'Registration successful', redirect: '/hackathons' });
    } catch (error) {
        console.error('Error registering for hackathon:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteHackathonById(id);
        res.status(200).json({ message: 'Hackathon deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, location, description, ageLimit } = req.body;
        await updateHackathonById(id, { name, date, location, description, ageLimit });
        res.status(200).json({ message: 'Hackathon updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.checkRegistration = async (req, res) => {
    const { hackathonId } = req.query;
    const userId = req.session.user.id; // Use session user ID

    try {
        const [existingRegistration] = await checkUserRegistration(userId, hackathonId);
        res.json({ registered: existingRegistration.length > 0 });
    } catch (error) {
        console.error('Error checking registration:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
