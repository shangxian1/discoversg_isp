import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { BACKEND_URL } from '../constants';
export default function Payment() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const activityName = String(state?.activityName ?? '').trim();
    const activityId = Number(state?.activityId);
    const price = Number(state?.price ?? 0);
    const noOfPax = Number(state?.noOfPax ?? state?.pax ?? 1);

    const unitPrice = Number.isFinite(price) ? price : 0;
    const computedTotal = unitPrice * (Number.isFinite(noOfPax) ? noOfPax : 0);

    const isFree = useMemo(() => !Number.isFinite(price) || price <= 0, [price]);

    const handlePay = async () => {
        setError('');

        if (!Number.isInteger(noOfPax) || noOfPax <= 0) {
            setError('Please select a valid pax size before continuing.');
            return;
        }

        const user = (() => {
            try {
                return JSON.parse(sessionStorage.getItem('user') || 'null');
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

        setLoading(true);
        try {
            // 1) Create a pending booking first so we can link it to Stripe.
            const bookingRes = await fetch(`${BACKEND_URL}/api/bookings/create-for-activity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    activityId,
                    noOfPax,
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

            // Free activities: confirm booking without Stripe.
            if (isFree) {
                const confirmRes = await fetch(`${BACKEND_URL}/api/payments/confirm-free`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookingId }),
                });
                const confirmData = await confirmRes.json();
                if (!confirmRes.ok) {
                    throw new Error(confirmData?.error || 'Failed to confirm free booking');
                }
                navigate('/your-activities');
                return;
            }

            // 2) Create Stripe checkout session for that booking.
            const res = await fetch(`${BACKEND_URL}/api/payments/create-checkout-session`, {
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

                            <Typography sx={{ mb: 1 }}>
                                Pax: {Number.isFinite(noOfPax) ? noOfPax : 1}
                            </Typography>

                            <Typography sx={{ mb: 1 }}>
                                Price / Pax: {isFree ? 'Free' : `$${unitPrice.toFixed(2)}`}
                            </Typography>

                            <Typography sx={{ mb: 3, fontWeight: 700 }}>
                                Total: {isFree ? 'Free' : `$${computedTotal.toFixed(2)}`}
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
