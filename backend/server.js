require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create table
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'To Do',
            priority TEXT DEFAULT 'Medium',
            dueDate TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (!err) {
                // Try migrating if the table already existed without these columns
                db.run(`ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'Medium'`, (e) => {});
                db.run(`ALTER TABLE tasks ADD COLUMN dueDate TEXT`, (e) => {});
            }
        });
    }
});

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
};

// Validation middleware
const validateTask = (req, res, next) => {
    const { title, status, priority, dueDate } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title is required and must be a valid string' });
    }
    const allowedStatuses = ['To Do', 'In Progress', 'Done'];
    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const allowedPriorities = ['Low', 'Medium', 'High'];
    if (priority && !allowedPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority' });
    }
    // simple date format check YYYY-MM-DD
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        return res.status(400).json({ error: 'Invalid due date format. Use YYYY-MM-DD' });
    }
    next();
};

// GET all tasks
app.get('/api/tasks', (req, res, next) => {
    db.all('SELECT * FROM tasks ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) return next(err);
        res.json(rows);
    });
});

// POST a new task
app.post('/api/tasks', validateTask, (req, res, next) => {
    const { title, description, status, priority, dueDate } = req.body;
    const currentStatus = status || 'To Do';
    const currentPriority = priority || 'Medium';
    
    db.run(
        'INSERT INTO tasks (title, description, status, priority, dueDate) VALUES (?, ?, ?, ?, ?)',
        [title, description, currentStatus, currentPriority, dueDate],
        function (err) {
            if (err) return next(err);
            res.status(201).json({ id: this.lastID, title, description, status: currentStatus, priority: currentPriority, dueDate });
        }
    );
});

// PUT (update) a task
app.put('/api/tasks/:id', validateTask, (req, res, next) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    
    db.run(
        'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, dueDate = ? WHERE id = ?',
        [title, description, status, priority, dueDate, id],
        function (err) {
            if (err) return next(err);
            if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
            res.json({ message: 'Task updated successfully' });
        }
    );
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res, next) => {
    const { id } = req.params;
    db.run('DELETE FROM tasks WHERE id = ?', id, function (err) {
        if (err) return next(err);
        if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    });
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
