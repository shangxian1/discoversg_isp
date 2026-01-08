const express = require('express');
const router = express.Router();
const db = require('../database'); // Assuming your DB connection file is here

// GET itinerary by ID with items and activity details
router.get('/itinerary/:id', (req, res) => {
    const itineraryId = req.params.id;

    // SQL query to join Itinerary, ItineraryItem, and Activity tables
    const sql = `
        SELECT 
            i.itineraryID, i.title, i.noOfDays, i.budgetLevel,
            ii.itineraryItemID, ii.dayNumber, ii.startTime, ii.endTime, ii.notes,
            a.activityName, a.location, a.activityPicUrl, a.price
        FROM itinerary i
        JOIN itineraryitem ii ON i.itineraryID = ii.itineraryID
        JOIN activity a ON ii.activityID = a.activityID
        WHERE i.itineraryID = ?
        ORDER BY ii.dayNumber ASC, ii.startTime ASC
    `;

    db.query(sql, [itineraryId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(444).json({ message: "Itinerary not found" });
        }

        // Format the data: Group items into an array inside the itinerary object
        const itineraryData = {
            itineraryID: results[0].itineraryID,
            title: results[0].title,
            noOfDays: results[0].noOfDays,
            budgetLevel: results[0].budgetLevel,
            items: results.map(row => ({
                itineraryItemID: row.itineraryItemID,
                dayNumber: row.dayNumber,
                startTime: row.startTime,
                endTime: row.endTime,
                activityName: row.activityName,
                location: row.location,
                activityPicUrl: row.activityPicUrl,
                notes: row.notes
            }))
        };

        res.json(itineraryData);
    });
});

module.exports = router;