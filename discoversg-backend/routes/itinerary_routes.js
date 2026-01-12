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

// POST: Save an AI-generated itinerary
router.post('/itinerary', (req, res) => {
    const { title, budgetLevel, noOfDays, items, userID = 1 } = req.body;

    // 1. Get a connection from the pool first
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Connection Error:", err);
            return res.status(500).json({ error: "Database connection failed" });
        }

        // 2. Start the transaction on the connection
        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: "Transaction start failed" });
            }

            const sqlItinerary = `INSERT INTO itinerary (userID, title, noOfDays, budgetLevel) VALUES (?, ?, ?, ?)`;
            connection.query(sqlItinerary, [userID, title, noOfDays, budgetLevel || 'Medium'], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        console.error("Itinerary Error:", err.message);
                        res.status(500).json({ error: err.message });
                    });
                }

                const itineraryID = result.insertId;

                // 3. Process each item sequentially or via promises
                const itemPromises = items.map(item => {
                    return new Promise((resolve, reject) => {
                        const sqlActivity = `INSERT INTO activity (categoryID, activityName, location, activityPicUrl) VALUES (?, ?, ?, ?)`;
                        // Using SUBSTRING to fit your current DB limits (30 chars for Name, 50 for Loc)
                        const safeName = item.activityName.substring(0, 30);
                        const safeLoc = item.location.substring(0, 50);

                        connection.query(sqlActivity, [1, safeName, safeLoc, item.activityPicUrl || '_'], (err, actResult) => {
                            if (err) return reject(err);
                            
                            const activityID = actResult.insertId;
                            const sqlItem = `INSERT INTO itineraryitem (itineraryID, activityID, dayNumber, startTime, notes) VALUES (?, ?, ?, ?, ?)`;
                            
                            connection.query(sqlItem, [itineraryID, activityID, item.dayNumber, item.startTime, item.notes], (err) => {
                                if (err) return reject(err);
                                resolve();
                            });
                        });
                    });
                });

                Promise.all(itemPromises)
                    .then(() => {
                        connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ error: err.message });
                                });
                            }
                            connection.release(); // Always release connection back to pool
                            res.status(201).json({ message: "Saved!", itineraryID });
                        });
                    })
                    .catch((error) => {
                        connection.rollback(() => {
                            connection.release();
                            console.error("Item Error:", error.message);
                            res.status(500).json({ error: error.message });
                        });
                    });
            });
        });
    });
});

module.exports = router;