const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',  // Replace with your MySQL passwordcd
  database: 'postuser', // Ensure your database is correct
});

// Test MySQL connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Register route
app.post('/api/register', async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields' });
  }

  connection.execute(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Server error' });
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const safePhone = phone || null;

        connection.execute(
          'INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)',
          [username, email, hashedPassword, safePhone],
          (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Server error' });
            res.status(200).json({ success: true, message: 'User registered successfully' });
          }
        );
      } catch (hashError) {
        res.status(500).json({ success: false, message: 'Error during password hashing' });
      }
    }
  );
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  connection.execute(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Server error' });
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ success: false, message: 'Server error' });
        if (isMatch) {
          res.status(200).json({ success: true, message: 'Login successful' });
        } else {
          res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
      });
    }
  );
});

// API to create a new post
app.post('/api/posts', (req, res) => {
  const { title, content, date, author, category } = req.body;

  if (!title || !content || !date || !author || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO posts (title, content, date, author, category) VALUES (?, ?, ?, ?, ?)';
  
  connection.query(
    query,
    [title, content, date, author, category],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Post created successfully', postId: result.insertId });
    }
  );
});

// API to get all posts
app.get('/api/posts', (req, res) => {
  connection.query('SELECT * FROM posts ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// API to get posts by category (e.g., travel)
app.get('/api/posts/category/:category', (req, res) => {
  const { category } = req.params;
  connection.query('SELECT * FROM posts WHERE category = ? ORDER BY id DESC', [category], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// DELETE a post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM posts WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Post is deleted' });
  });
});

// UPDATE a post
app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, date, author, category } = req.body;

  connection.query(
    'UPDATE posts SET title = ?, content = ?, date = ?, author = ?, category = ? WHERE id = ?',
    [title, content, date, author, category, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Post updated' });
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
