// filepath: /c:/Project/backend/server.js
const express = require("express");
const path = require("path");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");

const app = express();
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// Serve static frontend files from the correct directory
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Serve index.html for root route "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public", "index.html"));
});

// Serve Signup Page
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public", "Signup.html"));
});

// Serve Login Page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public", "login.html"));
});

// Serve Users Page
app.get("/users", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public", "users.html"));
});

// Serve Profile Page
app.get("/profile", (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, "../frontend/public", "profile.html"));
    } else {
        res.redirect("/signup");
    }
});

// Serve Hackathons Page
app.get("/hackathons", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public", "hackathons.html"));
});

// Serve Registration Page
app.get("/register-hackathon", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public", "register-hackathon.html"));
});

// Serve User Data
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.use('/api', userRoutes);
app.use('/api', hackathonRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});