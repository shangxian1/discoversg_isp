import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

// ================= FIX STATIC FILE SERVING =================

// Required to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 THIS IS THE IMPORTANT LINE
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debug log (optional but useful)
console.log("Serving uploads from:", path.join(__dirname, "uploads"));

// ================= DATABASE =================

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "DiscoverSG",
});

// ================= ROUTES =================

app.get("/", (req, res) => {
  res.send("DiscoverSG API running");
});

app.get("/api/carousel", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT activityID, activityName, activityPicUrl
      FROM Activity
      WHERE activityPicUrl IS NOT NULL
        AND activityPicUrl <> ''
      ORDER BY activityID DESC
      LIMIT 5
    `);

    // Convert filename → full URL
    const data = rows.map(row => ({
      ...row,
      activityPicUrl: `http://localhost:5000/uploads/${row.activityPicUrl}`
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ================= START SERVER =================

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
