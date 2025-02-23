const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('❌ SQLite Connection Error:', err.message);
    } else {
        console.log('✅ Connected to SQLite Database');
    }
});

// Create Users Table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

// Create Messages Table
db.run(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL
    )
`);

// Sign-Up Route
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [name, email, password],
        function (err) {
            if (err) return res.json({ success: false, message: 'Email already registered' });
            res.json({ success: true, message: 'User registered successfully!' });
        }
    );
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }
        res.json({ success: true, message: 'Login successful!' });
    });
});

// Post a Message
app.post('/message', (req, res) => {
    const { message } = req.body;

    db.run(`INSERT INTO messages (text) VALUES (?)`, [message], function (err) {
        if (err) return res.status(500).json({ success: false, message: 'Error posting message' });
        res.json({ success: true, message: 'Message posted!' });
    });
});

// Get All Messages
app.get('/messages', (req, res) => {
    db.all(`SELECT * FROM messages ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Error fetching messages' });
        res.json(rows);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
