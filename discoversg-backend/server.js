require('dotenv').config();

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

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', aiRoutes);
app.use('/api', activityRoutes);
app.use('/api', itineraryRoutes);
app.use('/api', authRoutes);
app.use('/api', algoRoutes);
app.use('/api', feedRoutes);
app.use('/api', paymentRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));