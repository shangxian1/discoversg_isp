const express = require("express");
const router = express.Router();
const cors = require("cors");
const db = require("../database");

router.use(cors());

router.get("/activities", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not connected" });
    }

    const [rows] = await db.execute(`
      SELECT
        a.activityID AS id,
        a.activityName AS title,
        c.categoryName AS category,
        a.location AS location,
        a.summary AS summary,
        a.description AS description,
        a.address AS address,
        a.price AS price,
        a.activityPicUrl AS image
      FROM activity a
      LEFT JOIN category c ON a.categoryID = c.categoryID
      ORDER BY a.activityID ASC
    `);

    const formatted = rows.map((row) => {
      // ✅ IMPORTANT CHANGE:
      // Return ONLY the filename so frontend can use /assets/<filename>
      const imageFilename =
        row.image && row.image !== "_" ? row.image : null;

      return {
        id: row.id,
        title: row.title,
        category: row.category ?? "General",
        location: row.location ?? "",
        summary: row.summary ?? "",
        description: row.description ?? "",
        address: row.address ?? "",
        price: row.price,
        image: imageFilename, 
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("GET /activities error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/locations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT location FROM activity WHERE location IS NOT NULL');
    const locations = rows.map(row => row.location);
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching locations' });
  }
});

module.exports = router;
