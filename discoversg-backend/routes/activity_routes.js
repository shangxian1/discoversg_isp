const express = require('express');
const router = express.Router();

router.get('/activities', (req, res) => {
    res.json([
        {
            id: 1,
            title: 'Painting',
            category: 'Arts & Culture',
            price: 67.67,
            image: 'https://via.placeholder.com/300',
        },
        {
            id: 2,
            title: 'Sightseeing',
            category: 'Outdoor & Nature',
            price: 61.61,
            image: 'https://via.placeholder.com/300',
        }
    ]);
});

module.exports = router;