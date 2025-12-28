// routes.js
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// Use 'var' or simply assign if you are facing redeclaration issues in certain environments,
// but usually, 'const' is fine if this is the only place it is declared in this scope.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const express = require('express');
const router = express.Router();
const cors = require('cors');

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// --- AI Itinerary Route ---
router.post('/ai', (req, res) => {
    const { place, travelDate } = req.body;
    main(place, travelDate)
        .then((response) => res.status(200).json({ "result": response }))
        .catch((error) => res.status(500).json(error));
});

async function main(place, travelDate) {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    try {
        const prompt = `Based on the area "${place}" in Singapore, generate a hidden gems itinerary...`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        let jsonString = response.text.trim().replace(/```json\s*|```\s*/g, '').trim();
        return JSON.parse(jsonString);
    } catch (e) {
        throw new Error("Unable to generate content.");
    }
}

// --- Auth Routes ---
// --- Updated Login Route in routes.js ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await global.db.execute(
            'SELECT userID, userName, roleID, profilePicUrl, userEmail, userDescription, CHAR_LENGTH(userPassword) as passLength FROM user WHERE userName = ? AND userPassword = ?',
            [username, password]
        );
        if (rows.length > 0) {
            const user = rows[0];
            res.status(200).json({
                success: true,
                user: { 
                    id: user.userID, 
                    name: user.userName, 
                    role: user.roleID, 
                    email: user.userEmail, 
                    profilePicUrl: user.profilePicUrl,
                    userDescription: user.userDescription,
                    passLength: user.passLength // Return the count of characters
                }
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// --- Unified Update Route ---
router.put('/update-profile', async (req, res) => {
    const { userID, userName, userEmail, userPassword, profilePicUrl, description } = req.body;
    if (!userID) return res.status(400).json({ success: false, message: "User ID missing" });

    try {
        let query, params;
        if (userPassword && userPassword.trim() !== "") {
            query = 'UPDATE user SET userName = ?, userEmail = ?, userPassword = ?, profilePicUrl = ?, userDescription = ?, updatedAt = NOW() WHERE userID = ?';
            params = [userName, userEmail, userPassword, profilePicUrl, description, userID];
        } else {
            query = 'UPDATE user SET userName = ?, userEmail = ?, profilePicUrl = ?, userDescription = ?, updatedAt = NOW() WHERE userID = ?';
            params = [userName, userEmail, profilePicUrl, description, userID];
        }
        await global.db.execute(query, params);
        res.status(200).json({ success: true, message: "Profile updated" });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: "Database Error" });
    }
});

router.put('/update-preferences', async (req, res) => {
    const { userID, nearbyLocation, budgetLevel, dietaryRequirements } = req.body;
    try {
        await global.db.execute(
            `INSERT INTO preference (userID, nearbyLocation, budgetLevel, dietaryRequirements) 
             VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE 
             nearbyLocation = VALUES(nearbyLocation), budgetLevel = VALUES(budgetLevel), dietaryRequirements = VALUES(dietaryRequirements)`,
            [userID, nearbyLocation, budgetLevel, dietaryRequirements]
        );
        res.status(200).json({ success: true, message: "Preferences updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Pref Error" });
    }
});

module.exports = router;