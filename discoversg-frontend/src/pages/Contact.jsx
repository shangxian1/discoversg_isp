import { useMemo, useRef, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import SnackBarDialog from '../components/layout/SnackBar';
import { BACKEND_URL } from '../constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value) {
    return value.replace(/\s+/g, ' ').trim();
}

export default function Contact() {
    const snackRef = useRef(null);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        message: '',
    });

    const [touched, setTouched] = useState({
        fullName: false,
        email: false,
        message: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const errors = useMemo(() => {
        const fullName = normalizeText(form.fullName);
        const email = normalizeText(form.email);
        const message = form.message.trim();

        const next = {};

        if (!fullName) next.fullName = 'Please enter your name.';
        else if (fullName.length < 2) next.fullName = 'Name is too short.';
        else if (fullName.length > 80) next.fullName = 'Name is too long.';

        if (!email) next.email = 'Please enter your email.';
        else if (!EMAIL_RE.test(email)) next.email = 'Please enter a valid email.';

        if (!message) next.message = 'Please enter your message.';
        else if (message.length < 10) next.message = 'Message is too short (min 10 characters).';
        else if (message.length > 1200) next.message = 'Message is too long (max 1200 characters).';

        return next;
    }, [form]);

    const hasErrors = Object.keys(errors).length > 0;

    const handleChange = (key) => (event) => {
        const value = event.target.value;
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleBlur = (key) => () => {
        setTouched((prev) => ({ ...prev, [key]: true }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setTouched({ fullName: true, email: true, message: true });

        if (Object.keys(errors).length > 0) {
            snackRef.current?.handleState('Please fix the highlighted fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                userName: normalizeText(form.fullName),
                userEmail: normalizeText(form.email),
                userFeedback: form.message.trim(),
            };

            const res = await fetch(`${BACKEND_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const msg = data?.message || 'Something went wrong. Please try again.';
                snackRef.current?.handleState(msg);
                return;
            }

            snackRef.current?.handleState(data?.message || 'Thanks! We received your message.');
            setForm({ fullName: '', email: '', message: '' });
            setTouched({ fullName: false, email: false, message: false });
        } catch (err) {
            snackRef.current?.handleState(err?.message || 'Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: 'background.default',
                py: { xs: 4, md: 7 },
            }}
        >
            <Container maxWidth="md">
                <Stack spacing={3} sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Contact Us
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Have feedback, a bug report, or a partnership idea? Drop us a message and we’ll get back to you.
                    </Typography>
                </Stack>

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' },
                        }}
                    >
                        {/* Left info panel */}
                        <Box
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                p: { xs: 3, md: 4 },
                            }}
                        >
                            <Stack spacing={2}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    We’re here to help
                                </Typography>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.25)' }} />

                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <SupportAgentIcon />
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                            Support
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Contact us via this form
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <MailOutlineIcon />
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                            Email
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            support@discoversg.example
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Right form panel */}
                        <Box sx={{ p: { xs: 3, md: 4 } }}>
                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <Stack spacing={2.25}>
                                    <TextField
                                        label="Full Name"
                                        value={form.fullName}
                                        onChange={handleChange('fullName')}
                                        onBlur={handleBlur('fullName')}
                                        error={touched.fullName && Boolean(errors.fullName)}
                                        helperText={touched.fullName ? errors.fullName : ' '}
                                        fullWidth
                                        autoComplete="name"
                                    />

                                    <TextField
                                        label="Email"
                                        value={form.email}
                                        onChange={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email ? errors.email : ' '}
                                        fullWidth
                                        autoComplete="email"
                                    />

                                    <TextField
                                        label="Feedback"
                                        value={form.message}
                                        onChange={handleChange('message')}
                                        onBlur={handleBlur('message')}
                                        error={touched.message && Boolean(errors.message)}
                                        helperText={touched.message ? errors.message : ' '}
                                        fullWidth
                                        multiline
                                        minRows={6}
                                    />

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting || hasErrors}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: 999,
                                                px: 3,
                                                py: 1.1,
                                            }}
                                            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
                                        >
                                            {isSubmitting ? 'Sending…' : 'Submit Feedback'}
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                <SnackBarDialog ref={snackRef} />
            </Container>
        </Box>
    );
}
