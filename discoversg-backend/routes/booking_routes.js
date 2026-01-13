const express = require('express');
const cors = require('cors');

const router = express.Router();

require('../database');

router.use(cors());
router.use(express.json());

router.post('/bookings/create-for-activity', async (req, res) => {
    try {
        const userId = Number(req.body?.userId);
        const activityId = Number(req.body?.activityId);
        const noOfPax = Number(req.body?.noOfPax ?? 1);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ error: 'userId must be a positive integer' });
        }
        if (!Number.isInteger(activityId) || activityId <= 0) {
            return res.status(400).json({ error: 'activityId must be a positive integer' });
        }
        if (!Number.isInteger(noOfPax) || noOfPax <= 0) {
            return res.status(400).json({ error: 'noOfPax must be a positive integer' });
        }

        if (!global.db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const [activityRows] = await global.db.execute(
            'SELECT COALESCE(activityDate, CURDATE()) AS sessionDate, COALESCE(activityTime, CURTIME()) AS sessionTime, price ' +
            'FROM activity WHERE activityID = ?',
            [activityId]
        );

        if (activityRows.length === 0) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        const sessionDate = activityRows[0].sessionDate;
        const sessionTime = activityRows[0].sessionTime;

        const [existingSessions] = await global.db.execute(
            'SELECT sessionID FROM activitysession WHERE activityID = ? AND sessionDate = ? AND sessionTime = ? LIMIT 1',
            [activityId, sessionDate, sessionTime]
        );

        let sessionId;
        if (existingSessions.length > 0) {
            sessionId = existingSessions[0].sessionID;
        } else {
            const [insertSession] = await global.db.execute(
                'INSERT INTO activitysession (activityID, sessionDate, sessionTime, capacity, spotsRemaining) VALUES (?, ?, ?, NULL, NULL)',
                [activityId, sessionDate, sessionTime]
            );
            sessionId = insertSession.insertId;
        }

        const [insertBooking] = await global.db.execute(
            "INSERT INTO booking (userID, sessionID, createdAt, noOfPax, status) VALUES (?, ?, NOW(), ?, 'PENDING')",
            [userId, sessionId, noOfPax]
        );

        return res.status(201).json({ bookingId: insertBooking.insertId, sessionId });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('POST /bookings/create-for-activity error:', error);
        return res.status(500).json({ error: 'Failed to create booking' });
    }
});

router.get('/bookings/paid/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ error: 'userId must be a positive integer' });
        }

        if (!global.db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const [rows] = await global.db.execute(
            `SELECT 
        b.bookingID,
        b.status,
        b.createdAt,
        b.noOfPax,
        s.sessionDate,
        s.sessionTime,
        a.activityID,
        a.activityName,
        a.description,
        a.price,
        a.activityPicUrl
      FROM booking b
      JOIN payment p ON p.bookingID = b.bookingID AND p.paymentStatus = 'SUCCESS'
      JOIN activitysession s ON s.sessionID = b.sessionID
      JOIN activity a ON a.activityID = s.activityID
      WHERE b.userID = ? AND b.status = 'PAID'
      ORDER BY b.createdAt DESC`,
            [userId]
        );

        const formatted = rows.map((r) => ({
            bookingID: r.bookingID,
            status: r.status,
            createdAt: r.createdAt,
            noOfPax: r.noOfPax,
            sessionDate: r.sessionDate,
            sessionTime: r.sessionTime,
            activityId: r.activityID,
            activityName: r.activityName,
            description: r.description,
            price: Number(r.price),
            activityPicUrl: r.activityPicUrl,
        }));

        return res.status(200).json(formatted);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('GET /bookings/paid/:userId error:', error);
        return res.status(500).json({ error: 'Failed to fetch paid bookings' });
    }
});

router.post('/bookings/cancel', async (req, res) => {
    try {
        const userId = Number(req.body?.userId);
        const bookingId = Number(req.body?.bookingId);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ error: 'userId must be a positive integer' });
        }
        if (!Number.isInteger(bookingId) || bookingId <= 0) {
            return res.status(400).json({ error: 'bookingId must be a positive integer' });
        }

        if (!global.db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const [rows] = await global.db.execute(
            'SELECT bookingID, status FROM booking WHERE bookingID = ? AND userID = ? LIMIT 1',
            [bookingId, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const currentStatus = rows[0].status;
        if (currentStatus === 'CANCELLED') {
            return res.status(200).json({ success: true, bookingId, status: 'CANCELLED' });
        }

        // Note: this is a logical cancel/hide. It does not refund Stripe.
        await global.db.execute(
            "UPDATE booking SET status = 'CANCELLED' WHERE bookingID = ? AND userID = ?",
            [bookingId, userId]
        );

        return res.status(200).json({ success: true, bookingId, status: 'CANCELLED' });
    } catch (error) {
        console.error('POST /bookings/cancel error:', error);
        return res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

module.exports = router;
