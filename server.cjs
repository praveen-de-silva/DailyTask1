const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pds2003@MS',
  database: 'task_app'
});

// API to get tasks by date
app.get('/tasks/:date', (req, res) => {
  const date = req.params.date;
  const sql = 'SELECT * FROM tasks WHERE due_date = ?';
  db.query(sql, [date], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// API to add a task
app.post('/tasks', (req, res) => {
  const { title, description, due_date } = req.body;
  const sql = 'INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)';
  db.query(sql, [title, description, due_date], (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).send('Task added!');
  });
});

// API to update task status
app.patch('/tasks/:id', (req, res) => {
  const { status } = req.body;
  const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.send('Task updated!');
  });
});

// API to delete a task
app.delete('/tasks/:id', (req, res) => {
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.send('Task deleted!');
  });
});


app.listen(5000, () => console.log('Server running on port 5000'));
