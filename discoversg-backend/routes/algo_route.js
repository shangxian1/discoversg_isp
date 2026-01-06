const express = require('express');
const router = express.Router();
const cors = require('cors');
require('../database');

// --- Recommendation Helper Functions ---

// 1. Helper: Fetch User Preferences & History using global.db
async function getUserProfile(userID) {
    const [prefRows] = await global.db.execute(
        "SELECT budgetLevel, dietaryRequirements, nearbyLocation FROM preference WHERE userID = ?",
        [userID]
    );

    // Default if no prefs found
    const preferences = prefRows[0] || { 
        budgetLevel: null, 
        dietaryRequirements: 'None',
        nearbyLocation: null 
    };

    // Get Implicit History (Past Bookings)
    const [historyRows] = await global.db.execute(`
        SELECT 
            c.categoryName, 
            a.tags
        FROM booking b
        JOIN activitysession s ON b.sessionID = s.sessionID
        JOIN activity a ON s.activityID = a.activityID
        JOIN category c ON a.categoryID = c.categoryID
        WHERE b.userID = ? AND b.status IN ('CONFIRMED', 'PAID')
    `, [userID]);

    const categoryHistory = new Set();
    const tagHistory = new Set();

    historyRows.forEach(row => {
        if (row.categoryName) categoryHistory.add(row.categoryName);
        if (row.tags) {
            // Split comma-separated tags into individual items
            row.tags.split(',').forEach(t => tagHistory.add(t.trim()));
        }
    });

    return { preferences, categoryHistory, tagHistory };
}

// 2. Helper: The Scoring Logic (Pure JS, no DB needed here)
function computeMatchStats(activity, userProfile) {
    let actualScore = 0;
    let maxPossibleScore = 0;
    
    const { preferences, categoryHistory, tagHistory } = userProfile;
    const activityTags = activity.tagsArray || []; // Safety fallback

    // --- A. Dietary Filter (Strict Exclusion) ---
    if (activity.categoryName === 'Food & Beverages' && preferences.dietaryRequirements !== 'None') {
        const hasDietary = activityTags.some(t => 
            t.toLowerCase() === preferences.dietaryRequirements.toLowerCase()
        );
        if (!hasDietary) return { score: 0, max: 0 }; 
    }

    // --- B. Budget Check (20 pts) ---
    if (preferences.budgetLevel) {
        maxPossibleScore += 20; 
        const price = parseFloat(activity.price);
        
        if (preferences.budgetLevel === 'Low' && price <= 20) actualScore += 20;
        else if (preferences.budgetLevel === 'Medium' && price <= 60) actualScore += 20;
        else if (preferences.budgetLevel === 'High') actualScore += 20; // High budget matches everything
    }

    // --- C. Location Check (15 pts) ---
    if (preferences.nearbyLocation && activity.location) {
        maxPossibleScore += 15;
        if (activity.location.toLowerCase().includes(preferences.nearbyLocation.toLowerCase())) {
            actualScore += 15;
        }
    }

    // --- D. Category History Check (15 pts) ---
    if (categoryHistory.size > 0) {
        maxPossibleScore += 15;
        if (categoryHistory.has(activity.categoryName)) {
            actualScore += 15;
        }
    }

    // --- E. Tag History Check ---    
    let tagsMatchedCount = 0;
    if (activityTags.length > 0) {
        activityTags.forEach(tag => {
            if (tagHistory.has(tag)) {
                tagsMatchedCount++;
            }
        });
    }

    // 2. Award points (e.g., 5 points per matched tag, up to a max of 20 bonus points)
    const tagBonus = Math.min(tagsMatchedCount * 5, 20); 
    actualScore += tagBonus;
    if (maxPossibleScore === 0) maxPossibleScore = 1;

    return { score: actualScore, max: maxPossibleScore };
}

// --- Recommendation Route ---

router.get('/recommendations/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        const userProfile = await getUserProfile(userID);
        
        const [activities] = await global.db.execute(`
            SELECT 
                a.activityID, a.activityName, a.price, a.location, 
                a.activityPicUrl, a.tags, c.categoryName
            FROM activity a
            JOIN category c ON a.categoryID = c.categoryID
        `);

        // Calculate Scores
        let ranked = activities.map(a => {
            const tagsArray = a.tags ? a.tags.split(',').map(t => t.trim()) : [];
            const { score, max } = computeMatchStats({ ...a, tagsArray }, userProfile);

            if (score === -1) return null; // Mark for deletion

            let finalRatio = (score / max);
            
            // Cap at 1.0 (100%) in case bonus points pushed it over
            if (finalRatio > 1.0) finalRatio = 1.0; 

            return {
                ...a,
                tags: tagsArray,
                matchScore: parseFloat(finalRatio.toFixed(2))
            };
        });

        ranked = ranked.filter(item => item !== null);

        // Sort by Highest Score
        ranked.sort((a, b) => b.matchScore - a.matchScore);

        // Return Top 5
        res.status(200).json(ranked.slice(0, 5));

    } catch (error) {
        console.error("Recommendation Error:", error);
        res.status(500).json({ success: false, message: "Error fetching recommendations" });
    }
});
module.exports = router;