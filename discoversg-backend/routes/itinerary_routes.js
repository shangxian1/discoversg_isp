const express = require('express');
const router = express.Router();
require('../database');

router.get('/itinerary', (req, res) => {
    res.json([
        { time: '10AM', title: 'Joo Chiat Heritage Walk '},
        { time: '12PM', title: 'Kway Guan Huat Popiah '},
        { time: '3PM', title: 'Sri Senpaga Vinayagar Temple '},
    ]);
});

module.exports = router;