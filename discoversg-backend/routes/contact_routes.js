const express = require('express');
const cors = require('cors');
require('../database');

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value) {
    return String(value ?? '').replace(/\s+/g, ' ').trim();
}

router.post('/contact', async (req, res) => {
    const userName = normalizeText(req.body.userName);
    const userEmail = normalizeText(req.body.userEmail);
    const userFeedback = String(req.body.userFeedback ?? '').trim();

    if (!userName || userName.length < 2 || userName.length > 80) {
        return res.status(400).json({ success: false, message: 'Invalid name.' });
    }

    if (!userEmail || !EMAIL_RE.test(userEmail) || userEmail.length > 254) {
        return res.status(400).json({ success: false, message: 'Invalid email.' });
    }

    if (!userFeedback || userFeedback.length < 10 || userFeedback.length > 1200) {
        return res.status(400).json({ success: false, message: 'Invalid feedback.' });
    }

    try {
        const [result] = await global.db.execute(
            'INSERT INTO userFeedback (userName, userEmail, userFeedback, createdAt) VALUES (?, ?, ?, NOW())',
            [userName, userEmail, userFeedback]
        );

        return res.status(201).json({
            success: true,
            message: 'Thanks! We received your message.',
            id: result.insertId,
        });
    } catch (error) {
        console.error('Contact insert error:', error);

        // Most common: table doesn\'t exist yet
        if (error?.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({
                success: false,
                message: 'Server is missing the contact feedback table. Please create it in phpMyAdmin.',
            });
        }

        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;
