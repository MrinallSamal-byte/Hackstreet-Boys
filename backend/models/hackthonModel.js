const db = require('../config/dbConfig');

exports.getAllHackathons = () => {
    return db.promise().query('SELECT * FROM hackathons');
};

exports.getHackathonById = (id) => {
    return db.promise().query('SELECT * FROM hackathons WHERE id = ?', [id]);
};

exports.getRegistrationsByHackathonId = (hackathonId) => {
    return db.promise().query('SELECT * FROM registrations WHERE hackathon_id = ?', [hackathonId]);
};

exports.createNewHackathon = (name, date, location, description, ageLimit) => {
    return db.promise().query('INSERT INTO hackathons (name, date, location, description, age_limit) VALUES (?, ?, ?, ?, ?)', [name, date, location, description, ageLimit]);
};

exports.registerUserForHackathon = (hackathonId, userId) => {
    return db.promise().query('INSERT INTO registrations (hackathon_id, user_id) VALUES (?, ?)', [hackathonId, userId]);
};

exports.checkUserRegistration = (userId, hackathonId) => {
    return db.promise().query('SELECT * FROM registrations WHERE user_id = ? AND hackathon_id = ?', [userId, hackathonId]);
};

exports.deleteHackathonById = (id) => {
    return db.promise().query('DELETE FROM hackathons WHERE id = ?', [id]);
};

exports.updateHackathonById = (id, updates) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    return db.promise().query(`UPDATE hackathons SET ${fields} WHERE id = ?`, [...values, id]);
};
