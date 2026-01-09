import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography } from '@mui/material';

export default function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9f9f9', py: 8 }}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{ borderRadius: 4, p: 4 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        Payment Cancelled
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        You cancelled the checkout.
                    </Typography>

                    <Button variant="outlined" fullWidth onClick={() => navigate('/activities')}>
                        Back to Activities
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}
