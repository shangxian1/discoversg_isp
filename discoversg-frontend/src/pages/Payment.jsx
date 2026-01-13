import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';

export default function Payment() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const activityName = String(state?.activityName ?? '').trim();
    const activityId = Number(state?.activityId);
    const price = Number(state?.price ?? 0);

    const isFree = useMemo(() => !Number.isFinite(price) || price <= 0, [price]);

    const handlePay = async () => {
        setError('');

        const user = (() => {
            try {
                return JSON.parse(localStorage.getItem('user') || 'null');
            } catch {
                return null;
            }
        })();

        const userId = Number(user?.id);
        if (!Number.isInteger(userId) || userId <= 0) {
            setError('Please log in to book and pay for activities.');
            return;
        }

        if (!activityName) {
            setError('Missing activity details. Please go back and try again.');
            return;
        }

        if (!Number.isInteger(activityId) || activityId <= 0) {
            setError('Missing activity ID. Please go back and try again.');
            return;
        }

        if (isFree) {
            navigate('/itinerary');
            return;
        }

        setLoading(true);
        try {
            // 1) Create a pending booking first so we can link it to Stripe.
            const bookingRes = await fetch('http://localhost:3000/api/bookings/create-for-activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    activityId,
                    noOfPax: 1,
                }),
            });

            const bookingData = await bookingRes.json();
            if (!bookingRes.ok) {
                throw new Error(bookingData?.error || 'Failed to create booking');
            }

            const bookingId = bookingData?.bookingId;
            if (!bookingId) {
                throw new Error('Booking ID missing');
            }

            // 2) Create Stripe checkout session for that booking.
            const res = await fetch('http://localhost:3000/api/payments/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || 'Failed to start payment');
            }

            if (!data?.url) {
                throw new Error('Stripe session URL missing');
            }

            window.location.href = data.url;
        } catch (e) {
            setError(e?.message || 'Failed to start payment');
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', py: 8 }}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{ borderRadius: 4, p: 4 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        Payment
                    </Typography>

                    {!activityName ? (
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Missing activity details. Please return to the activity page.
                        </Typography>
                    ) : (
                        <>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                You are about to add:
                            </Typography>

                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                {activityName}
                            </Typography>

                            <Typography sx={{ mb: 3 }}>
                                Price: {isFree ? 'Free' : `$${price}`}
                            </Typography>
                        </>
                    )}

                    {error ? (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    ) : null}

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                            fullWidth
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handlePay}
                            disabled={loading || !activityName}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : isFree ? 'Continue' : 'Pay with Card'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
