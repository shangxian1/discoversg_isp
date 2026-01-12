import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography } from '@mui/material';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const sessionId = params.get('session_id');

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', py: 8 }}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{ borderRadius: 4, p: 4 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        Payment Successful
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Your payment is complete.{sessionId ? ` Session: ${sessionId}` : ''}
                    </Typography>

                    <Button variant="contained" fullWidth onClick={() => navigate('/itinerary')}>
                        Go to Itinerary
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}
