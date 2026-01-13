import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const sessionId = params.get('session_id');

    const [confirming, setConfirming] = useState(Boolean(sessionId));
    const [error, setError] = useState('');

    useEffect(() => {
        if (!sessionId) return;

        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('http://localhost:3000/api/payments/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId }),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data?.error || 'Failed to confirm payment');
                }
            } catch (e) {
                if (!cancelled) setError(e?.message || 'Failed to confirm payment');
            } finally {
                if (!cancelled) setConfirming(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [sessionId]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', py: 8 }}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{ borderRadius: 4, p: 4 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        Payment Successful
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        {confirming
                            ? 'Confirming your payment…'
                            : error
                                ? `Payment was received, but confirmation failed: ${error}`
                                : 'Your payment is complete.'}
                    </Typography>

                    {confirming ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : null}

                    <Button variant="contained" fullWidth onClick={() => navigate('/your-activities')} disabled={confirming}>
                        View My Activity History
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}
