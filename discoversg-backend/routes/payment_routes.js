const express = require('express');
const cors = require('cors');

const router = express.Router();

require('../database');

router.use(cors());
router.use(express.json());

router.post('/payments/create-checkout-session', async (req, res) => {
    try {
        const stripeSecretKey = process.env.STRIPE_API_KEY;
        if (!stripeSecretKey) {
            return res.status(500).json({ error: 'Missing STRIPE_API_KEY in environment' });
        }

        const bookingId = Number(req.body?.bookingId);
        if (!Number.isInteger(bookingId) || bookingId <= 0) {
            return res.status(400).json({ error: 'bookingId must be a positive integer' });
        }

        if (!global.db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const [rows] = await global.db.execute(
            `SELECT 
                b.bookingID,
                b.status AS bookingStatus,
                b.noOfPax,
                a.activityID,
                a.activityName,
                a.price
            FROM booking b
            JOIN activitysession s ON s.sessionID = b.sessionID
            JOIN activity a ON a.activityID = s.activityID
            WHERE b.bookingID = ?
            LIMIT 1`,
            [bookingId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = rows[0];
        if (booking.bookingStatus !== 'PENDING') {
            return res.status(400).json({ error: `Booking status must be PENDING (got ${booking.bookingStatus})` });
        }

        const name = String(booking.activityName ?? '').trim();
        const unitPrice = Number(booking.price);
        const pax = Number(booking.noOfPax);

        if (!name) {
            return res.status(500).json({ error: 'Booking has missing activity name' });
        }
        if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
            return res.status(400).json({ error: 'This booking has no chargeable price' });
        }
        if (!Number.isInteger(pax) || pax <= 0) {
            return res.status(400).json({ error: 'Booking has invalid pax' });
        }

        // Stripe uses the smallest currency unit (cents).
        const unitAmount = Math.round(unitPrice * 100);
        if (unitAmount < 50) {
            return res.status(400).json({ error: 'price is too low to charge' });
        }

        const stripe = require('stripe')(stripeSecretKey);

        const clientUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            payment_intent_data: {
                metadata: {
                    bookingId: String(bookingId),
                    activityId: booking.activityID != null ? String(booking.activityID) : '',
                },
            },
            line_items: [
                {
                    quantity: pax,
                    price_data: {
                        currency: 'sgd',
                        unit_amount: unitAmount,
                        product_data: {
                            name,
                        },
                    },
                },
            ],
            metadata: {
                bookingId: String(bookingId),
                activityId: booking.activityID != null ? String(booking.activityID) : '',
            },
            success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${clientUrl}/payment/cancel`,
        });

        return res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('create-checkout-session error:', error);
        return res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

router.post('/payments/confirm', async (req, res) => {
    try {
        const stripeSecretKey = process.env.STRIPE_API_KEY;
        if (!stripeSecretKey) {
            return res.status(500).json({ error: 'Missing STRIPE_API_KEY in environment' });
        }

        const sessionId = String(req.body?.sessionId ?? '').trim();
        if (!sessionId) {
            return res.status(400).json({ error: 'sessionId is required' });
        }

        if (!global.db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const stripe = require('stripe')(stripeSecretKey);
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const paymentStatus = String(session?.payment_status ?? '').toLowerCase();
        const bookingIdRaw = session?.metadata?.bookingId;
        const bookingId = Number(bookingIdRaw);

        if (!Number.isInteger(bookingId) || bookingId <= 0) {
            return res.status(400).json({ error: 'Stripe session missing valid bookingId metadata' });
        }

        if (paymentStatus !== 'paid') {
            await global.db.execute("UPDATE booking SET status = 'FAILED' WHERE bookingID = ? AND status = 'PENDING'", [bookingId]);
            await global.db.execute(
                "INSERT INTO payment (bookingID, amount, paymentMethod, paymentStatus, paidAt) VALUES (?, 0.00, 'STRIPE', 'FAILED', NULL) " +
                "ON DUPLICATE KEY UPDATE paymentStatus = 'FAILED'",
                [bookingId]
            );
            return res.status(400).json({ error: `Payment not completed (status: ${session?.payment_status})` });
        }

        const amountTotal = Number(session?.amount_total ?? 0) / 100;

        await global.db.execute("UPDATE booking SET status = 'PAID' WHERE bookingID = ?", [bookingId]);
        await global.db.execute(
            "INSERT INTO payment (bookingID, amount, paymentMethod, paymentStatus, paidAt) VALUES (?, ?, 'STRIPE', 'SUCCESS', NOW()) " +
            "ON DUPLICATE KEY UPDATE amount = VALUES(amount), paymentMethod = VALUES(paymentMethod), paymentStatus = 'SUCCESS', paidAt = NOW()",
            [bookingId, amountTotal]
        );

        return res.status(200).json({ success: true, bookingId });
    } catch (error) {
        console.error('payments/confirm error:', error);
        return res.status(500).json({ error: 'Failed to confirm payment' });
    }
});

// Confirm a free booking (no Stripe). Creates a payment record with amount 0.
router.post('/payments/confirm-free', async (req, res) => {
    try {
        const bookingId = Number(req.body?.bookingId);
        if (!Number.isInteger(bookingId) || bookingId <= 0) {
            return res.status(400).json({ error: 'bookingId must be a positive integer' });
        }

        if (!global.db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const [rows] = await global.db.execute(
            `SELECT 
                b.bookingID,
                b.status AS bookingStatus,
                a.price
            FROM booking b
            JOIN activitysession s ON s.sessionID = b.sessionID
            JOIN activity a ON a.activityID = s.activityID
            WHERE b.bookingID = ?
            LIMIT 1`,
            [bookingId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = rows[0];
        if (booking.bookingStatus !== 'PENDING') {
            return res.status(400).json({ error: `Booking status must be PENDING (got ${booking.bookingStatus})` });
        }

        const unitPrice = Number(booking.price);
        if (Number.isFinite(unitPrice) && unitPrice > 0) {
            return res.status(400).json({ error: 'This booking is not free' });
        }

        await global.db.execute("UPDATE booking SET status = 'PAID' WHERE bookingID = ?", [bookingId]);
        await global.db.execute(
            "INSERT INTO payment (bookingID, amount, paymentMethod, paymentStatus, paidAt) VALUES (?, 0.00, 'FREE', 'SUCCESS', NOW()) " +
            "ON DUPLICATE KEY UPDATE amount = VALUES(amount), paymentMethod = VALUES(paymentMethod), paymentStatus = 'SUCCESS', paidAt = NOW()",
            [bookingId]
        );

        return res.status(200).json({ success: true, bookingId });
    } catch (error) {
        console.error('payments/confirm-free error:', error);
        return res.status(500).json({ error: 'Failed to confirm free booking' });
    }
});

router.post('/payments/refund', async (req, res) => {
    try {
        const stripeSecretKey = process.env.STRIPE_API_KEY;
        if (!stripeSecretKey) {
            return res.status(500).json({ error: 'Missing STRIPE_API_KEY in environment' });
        }

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

        const [bookingRows] = await global.db.execute(
            `SELECT 
                b.bookingID,
                b.userID,
                b.status AS bookingStatus,
                s.sessionDate,
                s.sessionTime
            FROM booking b
            JOIN activitysession s ON s.sessionID = b.sessionID
            WHERE b.bookingID = ? AND b.userID = ?
            LIMIT 1`,
            [bookingId, userId]
        );

        if (bookingRows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = bookingRows[0];
        if (booking.bookingStatus !== 'PAID') {
            return res.status(400).json({ error: `Only PAID bookings can be refunded (got ${booking.bookingStatus})` });
        }

        // Refund policy: only before the session start datetime.
        // sessionTime is non-null in schema; sessionDate is non-null.
        const sessionDate = String(booking.sessionDate).slice(0, 10);
        const sessionTime = String(booking.sessionTime).slice(0, 8);
        const sessionStart = new Date(`${sessionDate}T${sessionTime}`);
        const now = new Date();

        if (!(sessionStart instanceof Date) || Number.isNaN(sessionStart.valueOf())) {
            return res.status(500).json({ error: 'Invalid session date/time on booking' });
        }

        if (now >= sessionStart) {
            return res.status(400).json({ error: 'Refund not allowed: booking session has already started/passed' });
        }

        const [paymentRows] = await global.db.execute(
            'SELECT paymentStatus FROM payment WHERE bookingID = ? LIMIT 1',
            [bookingId]
        );

        if (paymentRows.length === 0) {
            return res.status(400).json({ error: 'No payment record found for this booking' });
        }

        const currentPaymentStatus = paymentRows[0].paymentStatus;
        if (currentPaymentStatus === 'REFUNDED') {
            return res.status(200).json({ success: true, bookingId, refunded: true });
        }
        if (currentPaymentStatus !== 'SUCCESS') {
            return res.status(400).json({ error: `Only SUCCESS payments can be refunded (got ${currentPaymentStatus})` });
        }

        const stripe = require('stripe')(stripeSecretKey);

        // Find the succeeded PaymentIntent by metadata.bookingId.
        // Note: this requires we set payment_intent_data.metadata on checkout session creation.
        const search = await stripe.paymentIntents.search({
            query: `metadata['bookingId']:'${bookingId}'`,
            limit: 1,
        });

        const paymentIntent = search?.data?.[0];
        if (!paymentIntent || paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                error:
                    'Could not locate a refundable Stripe PaymentIntent for this booking. ' +
                    'If this payment was made before refunds were enabled, it may not be refundable through the app.',
            });
        }

        const refund = await stripe.refunds.create({ payment_intent: paymentIntent.id });

        await global.db.execute(
            "UPDATE payment SET paymentStatus = 'REFUNDED' WHERE bookingID = ?",
            [bookingId]
        );
        await global.db.execute(
            "UPDATE booking SET status = 'CANCELLED' WHERE bookingID = ?",
            [bookingId]
        );

        return res.status(200).json({ success: true, bookingId, refundId: refund.id });
    } catch (error) {
        console.error('payments/refund error:', error);
        return res.status(500).json({ error: 'Failed to process refund' });
    }
});

module.exports = router;
