const express = require('express');
const router = express.Router();
require('../database'); 

// 1. GET History for a specific User
router.get('/history/:userID', async (req, res) => {
    const { userID } = req.params;
    try {
        if (!db) return res.status(500).json({ error: "DB not connected" });

        // Join Booking -> Session -> Activity
        const [rows] = await db.execute(`
            SELECT 
                b.bookingID,
                b.noOfPax,
                b.status,
                DATE_FORMAT(s.sessionDate, '%Y-%m-%d') as formattedDate,
                s.sessionTime,
                a.activityName,
                a.description,
                a.summary,
                a.price,
                a.location,
                a.activityPicUrl
            FROM booking b
            JOIN activitysession s ON b.sessionID = s.sessionID
            JOIN activity a ON s.activityID = a.activityID
            WHERE b.userID = ? 
            ORDER BY s.sessionDate DESC
        `, [userID]);

        const formattedHistory = rows.map(item => ({
            ...item,
            activityPicUrl: (item.activityPicUrl && item.activityPicUrl !== '_') 
                ? `http://localhost:3000/assets/${item.activityPicUrl}` 
                : "https://via.placeholder.com/300?text=No+Image"
        }));

        res.json(formattedHistory);

    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// 2. DELETE a Booking (Remove from history)
router.delete('/history/:bookingID', async (req, res) => {
    const { bookingID } = req.params;
    try {
        await db.execute('DELETE FROM booking WHERE bookingID = ?', [bookingID]);
        res.json({ success: true, message: "Booking removed" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: "Failed to delete booking" });
    }
});

module.exports = router;