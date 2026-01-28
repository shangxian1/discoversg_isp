const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const aiRoutes = require('./routes/ai_routes');
const authRoutes = require('./routes/auth_routes');
const activityRoutes = require('./routes/activity_routes');
const itineraryRoutes = require('./routes/itinerary_routes');
const feedRoutes = require('./routes/feed_routes');
const algoRoutes = require('./routes/algo_route');
const paymentRoutes = require('./routes/payment_routes');
const historyRoutes = require('./routes/history_route');
const bookingRoutes = require('./routes/booking_routes');
const contactRoutes = require('./routes/contact_routes');
const favouritesRoutes = require('./routes/favourite');

app.use(cors({
    origin: [
        'https://discoversg-7nyft.ondigitalocean.app/',
        'http://localhost:5173'
    ]
}));
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api', aiRoutes);
app.use('/api', activityRoutes);
app.use('/api', itineraryRoutes);
app.use('/api', authRoutes);
app.use('/api', algoRoutes);
app.use('/api', feedRoutes);
app.use('/api', paymentRoutes);
app.use('/api', historyRoutes);
app.use('/api', bookingRoutes);
app.use('/api', contactRoutes);
app.use("/api/favourites", favouritesRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));