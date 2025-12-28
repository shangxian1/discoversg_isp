const express = require('express');
const cors = require('cors'); // Added CORS
const mysql = require('mysql2');

const aiRoutes = require('./routes/ai_routes'); // This points to your router file
const activityRoutes = require('./routes/activity_routes');
const itineraryRoutes = require('./routes/itinerary_routes');

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
app.use('/api', aiRoutes);
app.use('/api', activityRoutes);
app.use('/api', itineraryRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));

/* const express = require('express');
const cors = require('cors'); // Added CORS
const mysql = require('mysql2');

const aiRoutes = require('./routes/ai_routes'); // This points to your router file
const activityRoutes = require('./routes/activities_routes');
const itineraryRoutes = require('./routes/itinerary_routes');

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
app.use('/api', aiRoutes);
app.use('/api', activityRoutes);
app.use('/api', itineraryRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`)); */