const express = require('express');
const cors = require('cors'); // Added CORS
const mysql = require('mysql2');
const AIRoute = require('./routes'); // This points to your router file

const app = express();
const port = 3000;

// 1. Middlewares (Must be ABOVE your routes)
app.use(cors()); // Allows React to connect
app.use(express.json()); // Allows Express to read JSON data from React
app.use(express.urlencoded({ extended: true }));

// 2. Database Connection (Internal to this file or moved to db.js)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      
  password: '',      
  database: 'discoversg', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Make the pool globally accessible for your routes
global.db = pool.promise();

// 3. Routes
app.use('/', AIRoute);

app.listen(port, () => console.log(`Server is running on port ${port}`));