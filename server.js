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

// Create Messages Table (If not exists)
db.run(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    )
`);

// ✅ Automatically Delete Messages Older Than 7 Days Using JavaScript
setInterval(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    db.run(`DELETE FROM messages WHERE created_at <= ?`, [sevenDaysAgo], function (err) {
        if (err) {
            console.error("❌ Error deleting old messages:", err.message);
        } else {
            console.log("🗑️ Deleted messages older than 7 days.");
        }
    });
}, 24 * 60 * 60 * 1000); // Runs every 24 hours

// 🚀 Post a Message with Timestamp
app.post('/message', (req, res) => {
    const { message } = req.body;
    const timestamp = Date.now(); // Get current time in milliseconds

    db.run(`INSERT INTO messages (text, created_at) VALUES (?, ?)`, [message, timestamp], function (err) {
        if (err) return res.status(500).json({ success: false, message: 'Error posting message' });
        res.json({ success: true, message: 'Message posted!' });
    });
});

// 🚀 Get All Messages (Newest First)
app.get('/messages', (req, res) => {
    db.all(`SELECT * FROM messages ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: 'Error fetching messages' });
        res.json(rows);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
