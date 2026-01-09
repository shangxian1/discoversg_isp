import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';

export default function Payment() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const activityName = String(state?.activityName ?? '').trim();
    const activityId = state?.activityId;
    const price = Number(state?.price ?? 0);

    const isFree = useMemo(() => !Number.isFinite(price) || price <= 0, [price]);

    const handlePay = async () => {
        setError('');

        if (!activityName) {
            setError('Missing activity details. Please go back and try again.');
            return;
        }

        if (isFree) {
            navigate('/itinerary');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/payments/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    activityId,
                    activityName,
                    price,
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
