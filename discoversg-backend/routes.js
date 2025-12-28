const { GoogleGenAI } = require('@google/genai');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

require('dotenv').config();

const express = require('express');
const router = express.Router();
const cors = require('cors');

router.use(cors());
router.use(express.json());

router.use(express.urlencoded({
  extended: true
}));

router.post('/ai', (req, res) => {
  const { place, travelDate } = req.body;

  main(place, travelDate)
    .then((response) => {
      res.status(200).json({ "result": response });
    })
    .catch((error) => {
      res.status(500).json(error);
    })

});

async function main(place, travelDate) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  try {
    const prompt =
      `Based on the area "${place}" in Singapore, generate a hidden gems itinerary featuring lesser-known attractions and dining options.  
  The itinerary should cover up to 2 days, each with a chronological timeline of activities.

  Return the response strictly as a valid JSON object with the following structure:
  {
    "itinerary_name": string,              
    "travel_date": string,                 
    "day_count": number,                   
    "days": [
      {
        "day": number,                    
        "itinerary": [
          {
            "time": string,                
            "place_name": string, 
            "coordinates": { "lat": number, "lng": number }, // <--- NEW: CRITICAL FOR MAPPING
            "description": string,        
            "hidden_gem_factor": string,   
            "dining_option": object | null,
            "getting_there": string        
          },
        ]
      },
      ...                                  
    ]
  }

  Ensure:
  - The JSON is valid and contains **no markdown or extra text**.  
  - The "coordinates" field contains number values for Singapore (approx lat: 1.35, lng: 103.8).
  - Each day’s timeline has at least 3–5 entries.  
  - The travel_date field uses the format "YYYY-MM-DD".`
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // 1. Get the raw string response
    let jsonString = response.text.trim();

    // 2. Clean the string by removing Markdown code fences (```json or ```)
    const markdownRegex = /```json\s*|```\s*/g;
    jsonString = jsonString.replace(markdownRegex, '').trim();

    // 3. Parse the cleaned string into a JS object
    const jsonObject = JSON.parse(jsonString);

    return jsonObject;
  } catch (e) {
    console.log(e.message);
    throw new Error("Unable to generate content.");
  }

}

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide both username and password" });
  }

  try {
    const [rows] = await global.db.execute(
      'SELECT userID, userName, roleID FROM user WHERE userName = ? AND userPassword = ?',
      [username, password]
    );

    if (rows.length > 0) {
      const user = rows[0];
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user.userID,
          name: user.userName,
          role: user.roleID
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Username and password are required" 
    });
  }

  try {
    const [existingUsers] = await global.db.execute(
      'SELECT userID FROM user WHERE userName = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: "Username is already taken" 
      });
    }

    const defaultEmail = `${username}@discoversg.com`; 
    
    const [result] = await global.db.execute(
      'INSERT INTO user (roleID, userName, userPassword, userEmail, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [1, username, password, defaultEmail]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId
    });

  } catch (error) {
    console.error("Signup Database Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during registration" 
    });
  }
});

module.exports = router;