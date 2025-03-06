const db = require('../config/dbConfig');

exports.createUser = (username, email, password, role, phone = null, dob = null, description = null, institution = null) => {
    return db.promise().query(
        'INSERT INTO users (username, email, password, role, phone, dob, description, institution, likes, dislikes, dob_updates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)', 
        [username, email, password, role, phone, dob, description, institution]
    );
};

exports.findUserByEmail = (email) => {
    return db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
};

exports.findUserByUsername = (username) => {
    return db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
};

exports.searchUsersByUsername = (query) => {
    return db.promise().query('SELECT id, username, role, likes, dislikes FROM users WHERE username LIKE ?', [`%${query}%`]);
};

exports.updateUserById = (id, updates) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    return db.promise().query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
};

exports.updateUserDescription = (userId, description) => {
    return db.promise().query('UPDATE users SET description = ? WHERE id = ?', [description, userId]);
};

exports.updateUserDob = (userId, dob) => {
    return db.promise().query('UPDATE users SET dob = ?, dob_updates = dob_updates + 1 WHERE id = ? AND dob_updates < 2', [dob, userId]);
};

exports.updateUserInDb = (userId, { username, email, dob, phone, institution }) => {
    return db.promise().query(
        'UPDATE users SET username = ?, email = ?, dob = ?, phone = ?, institution = ? WHERE id = ?',
        [username, email, dob, phone, institution, userId]
    );
};

exports.checkUserRating = (userId, targetUserId) => {
    return db.promise().query('SELECT * FROM user_ratings WHERE user_id = ? AND target_user_id = ?', [userId, targetUserId]);
};

exports.addUserRating = (userId, targetUserId, rating) => {
    return db.promise().query('INSERT INTO user_ratings (user_id, target_user_id, rating) VALUES (?, ?, ?)', [userId, targetUserId, rating]);
};