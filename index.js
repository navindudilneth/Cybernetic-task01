const express = require('express');
const mysql = require('mysql2'); 
const cors = require('cors'); 

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'crud' 
});

// MySQL connector
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Add users
app.post('/users', (req, res) => {
    const { name, contact, age, address} = req.body;
    const sql = 'INSERT INTO users (name, contact, age, address) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, contact, age, address], (err, result) => {
        if (err) {
            return res.json({ error: err.message });
        }
        res.json({ id: result.insertId, name, contact, age, address});
    });
});

// Get all users
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            return res.json({ error: err.message });
        }
        res.json(results);
    });
});

// Search for users by ID
app.get('/users/:id', (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.json({ error: err.message });
        }
        res.json(results[0]); 
    });
});

// Update users
app.put('/users/:id', (req, res) => {
    const { name, contact, age, address } = req.body;
    const sql = 'UPDATE users SET name = ?, contact = ?, age = ?, address = ? WHERE id = ?';
    db.query(sql, [name, contact, age, address, req.params.id], (err, result) => {
        if (err) {
            return res.json({ error: err.message });
        }
        res.json({ id: req.params.id, name, contact, age, address });
    });
});

// Delete users
app.delete('/users/:id', (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.json({ error: err.message });
        }
        res.send(); 
    });
});

//Starting server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
