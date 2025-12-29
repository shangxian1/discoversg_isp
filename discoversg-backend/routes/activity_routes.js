const express = require('express');
const router = express.Router();
require('../database');

router.get('/activities', (req, res) => {
    res.json([
        {
            id: 1,
            title: 'Painting',
            category: 'Arts & Culture',
            description: 'Participants immersed themselves in the joyful, creative act of bringing color and form to life.',
            price: 67.67,
            image: 'https://placehold.co/200',
        },
        {
            id: 2,
            title: 'Sightseeing',
            category: 'Outdoor & Nature',
            description:'Participants immersed themselves in the joyful, creative act of bringing color and form to life.',
            price: 61.61,
            image: 'https://placehold.co/200',
        }
    ]);
});

module.exports = router;