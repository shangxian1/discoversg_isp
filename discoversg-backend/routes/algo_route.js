const express = require('express');
const router = express.Router();
require('../database'); 

console.log("ALGO ROUTES FILE LOADED! (Bonus Location Logic)");

// --- 1. Helper Functions ---

async function getUserProfile(userID) {
    if (!global.db) throw new Error("Database connection missing!");

    // 1. Get Explicit Preferences
    const [prefRows] = await global.db.execute(
        "SELECT budgetLevel, dietaryRequirements, nearbyLocation FROM preference WHERE userID = ?",
        [userID]
    );

    const preferences = prefRows[0] || { 
        budgetLevel: null, 
        dietaryRequirements: 'None',
        nearbyLocation: null 
    };

    // 2. Get Implicit History (Past Bookings)
    const [historyRows] = await global.db.execute(`
        SELECT c.categoryName, a.tags
        FROM booking b
        JOIN activitysession s ON b.sessionID = s.sessionID
        JOIN activity a ON s.activityID = a.activityID
        JOIN category c ON a.categoryID = c.categoryID
        WHERE b.userID = ? AND b.status IN ('CONFIRMED', 'PAID')
    `, [userID]);

    const categoryCounts = {};
    const tagCounts = {};
    let totalBookings = 0;

    historyRows.forEach(row => {
        totalBookings++;
        if (row.categoryName) {
            categoryCounts[row.categoryName] = (categoryCounts[row.categoryName] || 0) + 1;
        }
        if (row.tags) {
            row.tags.split(',').forEach(t => {
                const tag = t.trim();
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
    });

    return { preferences, categoryCounts, tagCounts, totalBookings };
}

function computeMatchStats(activity, userProfile) {
    let actualScore = 0;
    let maxPossibleScore = 0;
    
    const { preferences, categoryCounts, tagCounts, totalBookings } = userProfile;
    const activityTags = activity.tagsArray || [];

    // --- A. Dietary Filter (Strict) ---
    const NO_RESTRICTION_KEYWORDS = ['none', 'nil', 'no', 'null', 'n/a', '-', '', 'vacant'];
    const userDiet = preferences.dietaryRequirements ? preferences.dietaryRequirements.toLowerCase().trim() : 'none';

    if (activity.categoryName === 'Food & Beverages' && !NO_RESTRICTION_KEYWORDS.includes(userDiet)) {
        const hasDietary = activityTags.some(t => t.toLowerCase() === userDiet);
        if (!hasDietary) return { score: -1, max: 0 }; 
    }

    // --- B. Budget Check (Base: 30 pts) ---
    if (preferences.budgetLevel) {
        maxPossibleScore += 30; 
        const price = parseFloat(activity.price);
        
        // Logic: If it fits the budget, full points.
        if (preferences.budgetLevel === 'Low' && price <= 20) actualScore += 30;
        else if (preferences.budgetLevel === 'Medium' && price <= 60) actualScore += 30;
        else if (preferences.budgetLevel === 'High') actualScore += 30; 
    }

    // --- C. Location Check (BONUS ONLY: 10 pts) ---
    if (preferences.nearbyLocation && activity.location) {
        if (activity.location.toLowerCase().includes(preferences.nearbyLocation.toLowerCase())) {
            actualScore += 10; // Reduced from 15 to 10
        }
    }

    // --- D. Category History (Main Driver: 40 pts) ---
    if (totalBookings > 0) {
        maxPossibleScore += 40; 
        
        const count = categoryCounts[activity.categoryName] || 0;
        const frequency = count / totalBookings; 
        
        actualScore += (frequency * 40);
    }

    // --- E. Tag History (Bonus: 20 pts) ---
    if (totalBookings > 0 && activityTags.length > 0) {
        let tagScoreAccumulator = 0;

        activityTags.forEach(tag => {
            const count = tagCounts[tag] || 0;
            const frequency = count / totalBookings;
            tagScoreAccumulator += (frequency * 10); 
        });

        const finalTagBonus = Math.min(tagScoreAccumulator, 20);
        actualScore += finalTagBonus;
    }

    // Safety: Prevent divide by zero for brand new users with no preferences
    if (maxPossibleScore === 0) maxPossibleScore = 1;

    return { score: actualScore, max: maxPossibleScore };
}

// --- 2. The Route Handler ---

router.get('/recommendations/:userID', async (req, res) => {
    const { userID } = req.params;
    try {
        const userProfile = await getUserProfile(userID);
        
        if (!global.db) throw new Error("Database not connected");

        const [activities] = await global.db.execute(`
            SELECT a.activityID, a.activityName, a.price, a.location, 
                   a.activityPicUrl, a.tags, c.categoryName
            FROM activity a
            JOIN category c ON a.categoryID = c.categoryID
        `);

        let ranked = activities.map(a => {
            const tagsArray = a.tags ? a.tags.split(',').map(t => t.trim()) : [];
            const { score, max } = computeMatchStats({ ...a, tagsArray }, userProfile);

            if (score === -1) return null;

            let finalRatio = (score / max);
            if (finalRatio > 1.0) finalRatio = 1.0; 

            return {
                ...a,
                tags: tagsArray,
                matchScore: parseFloat(finalRatio.toFixed(2))
            };
        });

        ranked = ranked.filter(item => item !== null);
        ranked.sort((a, b) => b.matchScore - a.matchScore);

        res.status(200).json(ranked.slice(0, 5));

    } catch (error) {
        console.error("Recommendation Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;