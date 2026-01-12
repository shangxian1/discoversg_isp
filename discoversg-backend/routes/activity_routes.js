const express = require('express');
const router = express.Router();
const cors = require('cors');
require('../database');

router.use(cors());

router.get('/activities', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        // 1. Execute query to get all fields including 'description'
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

        // 2. Format the data for the React frontend
        const formatted = rows.map(row => {
            // FIX: Remove '/public' from the path. 
            // Files in 'public/assets/' are served at '/assets/'
            const imagePath = (row.image && row.image !== '_') 
                ? `/assets/${row.image}` 
                : 'https://placehold.co/600x400?text=No+Image';

            return {
                id: row.id,
                title: row.title,
                category: row.category ?? 'General',
                location: row.location ?? '',
                summary: row.summary ?? '',
                description: row.description ?? '', // Ensure this maps to your card
                address: row.address ?? '',
                price: row.price,
                image: imagePath,
            };
        });

        return res.status(200).json(formatted);
    } catch (error) {
        console.error('GET /activities error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;