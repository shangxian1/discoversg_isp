const express = require('express');
const cors = require('cors');

const router = express.Router();

router.use(cors());
router.use(express.json());

router.post('/payments/create-checkout-session', async (req, res) => {
    try {
        const stripeSecretKey = process.env.STRIPE_API_KEY;
        if (!stripeSecretKey) {
            return res.status(500).json({ error: 'Missing STRIPE_API_KEY in environment' });
        }

        const { activityId, activityName, price } = req.body ?? {};

        const name = String(activityName ?? '').trim();
        const rawPrice = Number(price);

        if (!name) {
            return res.status(400).json({ error: 'activityName is required' });
        }
        if (!Number.isFinite(rawPrice) || rawPrice < 0) {
            return res.status(400).json({ error: 'price must be a non-negative number' });
        }

        // Stripe uses the smallest currency unit (cents). Assume price is in dollars.
        const unitAmount = Math.round(rawPrice * 100);

        if (unitAmount < 50) {
            // Stripe generally requires a minimum charge amount depending on currency.
            return res.status(400).json({ error: 'price is too low to charge' });
        }

        const stripe = require('stripe')(stripeSecretKey);

        const clientUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    quantity: 1,
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
                activityId: activityId != null ? String(activityId) : '',
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

module.exports = router;
