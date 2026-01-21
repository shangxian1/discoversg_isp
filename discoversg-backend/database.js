/* const mysql = require('mysql2');

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

const db_string = 'mysql://doadmin:AVNS_kIVt5j17kdK1r8u3sPm@discoversgdb-do-user-32265640-0.j.db.ondigitalocean.com:25060/defaultdb?ssl-mode=REQUIRED';

const connection = mysql.createConnection(db_string);

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
})

if (!dbConfig.database) {
  throw new Error(
    "Database name is not configured. Set 'db' in discoversg-backend/.env (e.g., db=discoversg)."
  );
}

if (!global.db) {
  global.db = mysql.createPool(dbConfig);
}

module.exports = global.db; */

const mysql = require('mysql2/promise');

const dbConfig = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 25060,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  },
  connectTimeout: 10000
});

if (!global.db) {
  global.db = mysql.createPool(dbConfig);
}

module.exports = global.db;