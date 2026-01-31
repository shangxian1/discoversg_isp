const express = require('express');
const router = express.Router();
require('../database'); 

console.log("ALGO ROUTES FILE LOADED! (Using favourite_activity table)");

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

    const categoryCounts = {};
    const tagCounts = {};
    let totalInterests = 0;
    const favIDs = new Set();
    const favCategories = new Set(); 

    // 2. Get Booking History
    const [historyRows] = await global.db.execute(`
        SELECT c.categoryName, a.tags
        FROM booking b
        JOIN activitysession s ON b.sessionID = s.sessionID
        JOIN activity a ON s.activityID = a.activityID
        JOIN category c ON a.categoryID = c.categoryID
        WHERE b.userID = ? AND b.status IN ('CONFIRMED', 'PAID')
    `, [userID]);

    // 3. ✅ CHANGED: Get Favourites from 'favourite_activity'
    const [favRows] = await global.db.execute(`
        SELECT c.categoryName, a.tags, a.activityID
        FROM favourite_activity f
        JOIN activity a ON f.activityID = a.activityID
        JOIN category c ON a.categoryID = c.categoryID
        WHERE f.userID = ?
    `, [userID]);

    // Helper to process rows
    const processInterest = (row, weight = 1) => {
        totalInterests += weight;
        
        if (row.categoryName) {
            categoryCounts[row.categoryName] = (categoryCounts[row.categoryName] || 0) + weight;
        }
        
        if (row.tags) {
            row.tags.split(',').forEach(t => {
                const tag = t.trim();
                tagCounts[tag] = (tagCounts[tag] || 0) + weight;
            });
        }
    };

    // Process Bookings (Weight 1.0)
    historyRows.forEach(row => processInterest(row, 1.0));

    // Process Favourites (Weight 1.5 - Higher impact)
    favRows.forEach(row => {
        favIDs.add(row.activityID);
        favCategories.add(row.categoryName); 
        processInterest(row, 1.5);
    });

    return { preferences, categoryCounts, tagCounts, totalInterests, favIDs, favCategories };
}

function computeMatchStats(activity, userProfile) {
    let actualScore = 0;
    let maxPossibleScore = 0;
    
    const { preferences, categoryCounts, tagCounts, totalInterests, favIDs, favCategories } = userProfile;
    const activityTags = activity.tags ? activity.tags.split(',').map(t => t.trim()) : [];

    // --- A. Dietary Filter ---
    const NO_RESTRICTION_KEYWORDS = ['none', 'nil', 'no', 'null', 'n/a', '-', '', 'vacant'];
    const userDiet = preferences.dietaryRequirements ? preferences.dietaryRequirements.toLowerCase().trim() : 'none';

    if (activity.categoryName === 'Food & Beverages' && !NO_RESTRICTION_KEYWORDS.includes(userDiet)) {
        const hasDietary = activityTags.some(t => t.toLowerCase().includes(userDiet));
        if (!hasDietary) return { score: -1, max: 0 }; 
    }

    // --- 1. Direct Favourite Bonus (50 pts) ---
    // Pushes items you ALREADY favourited to the very top
    if (favIDs.has(activity.activityID)) {
        actualScore += 50; 
    }

    // --- 2. Favorited Category Bonus (30 pts) ---
    // Boosts similar items (e.g. if you fav "Museum", boost all "Museums")
    if (favCategories.has(activity.categoryName)) {
        actualScore += 30;
    }

    // --- 3. Budget Check (30 pts) ---
    if (preferences.budgetLevel) {
        maxPossibleScore += 30; 
        const price = parseFloat(activity.price);
        
        if (preferences.budgetLevel === 'Low' && price <= 20) actualScore += 30;
        else if (preferences.budgetLevel === 'Medium' && price > 20 && price <= 60) actualScore += 30;
        else if (preferences.budgetLevel === 'High' && price > 60) actualScore += 30;
    }

    // --- 4. Location Check (10 pts) ---
    if (preferences.nearbyLocation && activity.location) {
        if (activity.location.toLowerCase().includes(preferences.nearbyLocation.toLowerCase())) {
            actualScore += 10;
        }
    }

    // --- 5. History Frequency (40 pts) ---
    if (totalInterests > 0) {
        maxPossibleScore += 40; 
        const count = categoryCounts[activity.categoryName] || 0;
        const frequency = count / totalInterests; 
        actualScore += (frequency * 40);
    }

    // --- 6. Tag History (20 pts) ---
    if (totalInterests > 0 && activityTags.length > 0) {
        let tagScoreAccumulator = 0;
        activityTags.forEach(tag => {
            const count = tagCounts[tag] || 0;
            const frequency = count / totalInterests;
            tagScoreAccumulator += (frequency * 10); 
        });
        const finalTagBonus = Math.min(tagScoreAccumulator, 20);
        actualScore += finalTagBonus;
    }

    if (maxPossibleScore === 0) maxPossibleScore = 1;

    return { score: actualScore, max: maxPossibleScore };
}

// --- 2. The Route Handler ---

router.get('/recommendations/:userID', async (req, res) => {
    const { userID } = req.params;
    const searchQuery = req.query.search || ""; 

    try {
        const userProfile = await getUserProfile(userID);
        
        if (!global.db) throw new Error("Database not connected");

        let sql = `
            SELECT a.activityID, a.activityName, a.price, a.location, 
                   a.activityPicUrl, a.tags, c.categoryName
            FROM activity a
            JOIN category c ON a.categoryID = c.categoryID
        `;
        
        const params = [];

        // Search Filter
        if (searchQuery.trim() !== "") {
            sql += ` WHERE (a.activityName LIKE ? OR c.categoryName LIKE ? OR a.tags LIKE ?)`;
            const term = `%${searchQuery}%`;
            params.push(term, term, term);
        }

        const [activities] = await global.db.execute(sql, params);

        let ranked = activities.map(a => {
            const { score, max } = computeMatchStats(a, userProfile);

            if (score === -1) return null;

            let finalRatio = (score / max);
            if (finalRatio > 1.5) finalRatio = 1.5; // Cap bonus at 150% match

            return {
                id: a.activityID, 
                title: a.activityName,
                image: a.activityPicUrl,
                category: a.categoryName,
                ...a,
                matchScore: parseFloat(finalRatio.toFixed(2))
            };
        });

        ranked = ranked.filter(item => item !== null);
        
        // Sort descending by score
        ranked.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(ranked.slice(0, 5));   
    } catch (error) {
        console.error("Recommendation Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;