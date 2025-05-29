const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create SQLite database connection
const db = new sqlite3.Database('feedback.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the feedback database');
        // Create feedbacks table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patientUsername TEXT NOT NULL,
            feedback TEXT NOT NULL,
            date TEXT NOT NULL
        )`);
    }
});

// Submit feedback
router.post('/api/feedback', (req, res) => {
    const { patientUsername, feedback, date } = req.body;

    if (!patientUsername || !feedback || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO feedbacks (patientUsername, feedback, date) VALUES (?, ?, ?)';
    db.run(query, [patientUsername, feedback, date], function (err) {
        if (err) {
            console.error('Error submitting feedback:', err);
            return res.status(500).json({ error: 'Failed to submit feedback' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Get all feedbacks
router.get('/api/feedbacks', (req, res) => {
    const query = 'SELECT * FROM feedbacks ORDER BY date DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching feedbacks:', err);
            return res.status(500).json({ error: 'Failed to fetch feedbacks' });
        }
        res.json({ feedbacks: rows });
    });
});

// Delete feedback
router.delete('/api/feedback/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM feedbacks WHERE id = ?';
    db.run(query, [id], function (err) {
        if (err) {
            console.error('Error deleting feedback:', err);
            return res.status(500).json({ error: 'Failed to delete feedback' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.json({ success: true });
    });
});

// Close database connection when the server shuts down
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

module.exports = router; 