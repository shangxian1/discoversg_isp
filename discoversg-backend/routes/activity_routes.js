const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../database');

router.use(cors());

router.get('/activities', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const [rows] = await db.execute(`
            SELECT
                a.activityID AS id,
                a.activityName AS title,
                c.categoryName AS category,
                a.location AS description,
                a.price AS price,
                a.activityPicUrl AS image
            FROM activity a
            LEFT JOIN category c ON a.categoryID = c.categoryID
            ORDER BY a.activityID ASC
        `);

        const formatted = rows.map(row => ({
            id: row.id,
            title: row.title,
            category: row.category ?? '',
            description: row.description ?? '',
            price: row.price,
            image: row.image ?? 'https://placehold.co/200',
        }));

        return res.status(200).json(formatted);
    } catch (error) {
        console.error('GET /activities error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;