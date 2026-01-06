const express = require('express');
const app = express();
const port = process.env.port || 3000;

const aiRoutes = require('./routes/ai_routes');
const authRoutes = require('./routes/auth_routes');
const activityRoutes = require('./routes/activity_routes');
const itineraryRoutes = require('./routes/itinerary_routes');
const algoRoutes = require('./routes/algo_route');

// Routes
app.use('/api', aiRoutes);
app.use('/api', activityRoutes);
app.use('/api', itineraryRoutes);
app.use('/api', authRoutes);
app.use('/api', algoRoutes);


app.listen(port, () => console.log(`Server is running on port ${port}`));