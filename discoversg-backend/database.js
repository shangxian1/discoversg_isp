const mysql = require('mysql2/promise');

// Configuration using the env variables loaded
const dbConfig = {
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db, // Changed from db_name to db
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

if (!dbConfig.database) {
  throw new Error(
    "Database name is not configured. Set 'db' in discoversg-backend/.env (e.g., db=discoversg)."
  );
}

if (!global.db) {
  global.db = mysql.createPool(dbConfig);
}

module.exports = global.db;