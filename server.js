const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
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

// Create Users Table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`, (err) => {
    if (err) console.error('❌ Error Creating Users Table:', err.message);
});

// 🚀 Sign-Up Route
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Hash the password before storing it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.json({ success: false, message: 'Error hashing password' });

        // Insert user into SQLite database
        db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
            [name, email, hashedPassword],
            function (err) {
                if (err) {
                    return res.json({ success: false, message: 'Email already registered' });
                }
                console.log('✅ New User Registered:', email);
                res.json({ success: true, message: 'User registered successfully!' });
            }
        );
    });
});

// 🚀 Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        // Compare stored hashed password with input password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.json({ success: false, message: 'Invalid email or password' });
            }

            console.log('✅ User Logged In:', email);
            res.json({ success: true, message: 'Login successful!' });
        });
    });
});

// 🚀 Serve Sign-Up Page at Root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// 🚀 Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
