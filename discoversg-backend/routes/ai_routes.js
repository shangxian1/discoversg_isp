const { GoogleGenAI } = require('@google/genai');
const express = require('express');
const router = express.Router();
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/ai', async (req, res) => {
    const { place, travelDate } = req.body;

    try {
        const result = await main(place, travelDate);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function main(place, travelDate) {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const prompt = `Based on the area "${place}" in Singapore...`; // unchanged
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    let jsonString = response.text.trim();
    jsonString = jsonString.replace(/```json\s*|```\s*/g, '').trim();

    return JSON.parse(jsonString);
}

module.exports = router;
