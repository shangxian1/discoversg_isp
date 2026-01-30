const express = require("express");
const router = express.Router();
const cors = require("cors");
const db = require("../database");

router.use(cors());
router.use(express.json());

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
      // IMPORTANT CHANGE:
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

router.get('/activity/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid activity id' });
    }

    const [rows] = await db.execute(
      `SELECT 
        a.activityID,
        a.activityName,
        c.categoryName,
        a.location,
        a.address,
        a.summary,
        a.description,
        a.price,
        a.activityPicUrl
      FROM activity a
      LEFT JOIN category c ON a.categoryID = c.categoryID
      WHERE a.activityID = ?
      LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const row = rows[0];
    return res.status(200).json({
      activityID: row.activityID,
      activityName: row.activityName,
      categoryName: row.categoryName,
      location: row.location,
      address: row.address,
      summary: row.summary,
      description: row.description,
      price: row.price,
      activityPicUrl: row.activityPicUrl,
    });
  } catch (error) {
    console.error('GET /activity/:id error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve activity where it has the most amount of bookings
// Referencing to activitysession & booking tables
router.get('/featured-activity', async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM booking WHERE status = 'PAID' AND sessionID = (SELECT sessionID FROM booking GROUP BY sessionID ORDER BY COUNT(*) DESC LIMIT 1)`);
    if (rows.length > 0) {
      const [result] = await db.execute(`SELECT activityID FROM activitysession WHERE sessionID = ?`, [rows[0].sessionID]);
      if (result) {
        const [featuredActivity] = await db.execute(`SELECT
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
        WHERE a.activityID = ?
        ORDER BY a.activityID ASC`, [result[0].activityID]);

        if (featuredActivity) {
          const row = featuredActivity[0];
          const imageFilename = row.image && row.image !== "_" ? row.image : null;
          const formatted = {
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
          return res.status(200).json(formatted);
        } else {
          return res.status(404).json({ error: 'Popular Activity not found' });
        }
      } else {
        return res.status(500).json({ error: 'Internal Server Error' })
      }
    } else {
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router;
