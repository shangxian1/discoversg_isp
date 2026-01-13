const { GoogleGenAI } = require('@google/genai');
const express = require('express');
const router = express.Router();
const cors = require('cors');
require('../database');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/ai', async (req, res) => {
    const { place, noOfDays, includeDining } = req.body;

    try {
        const result = await main(place, noOfDays, includeDining);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// async function main(place, travelDate) {
  
//   try {
//     const prompt =
//       `Based on the area "${place}" in Singapore, generate a hidden gems itinerary featuring lesser-known attractions and dining options.  
//       The itinerary should cover up to 2 days, each with a chronological timeline of activities.

//   Return the response strictly as a valid JSON object with the following structure:
//   {
//     "itinerary_name": string,              
//     "travel_date": string,                 
//     "day_count": number,                   
//     "days": [
//       {
//         "day": number,                    
//         "itinerary": [
//           {
//             "time": string,                
//             "place_name": string, 
//             "coordinates": { "lat": number, "lng": number }, // <--- NEW: CRITICAL FOR MAPPING
//             "description": string,        
//             "hidden_gem_factor": string,   
//             "dining_option": object | null,
//             "getting_there": string        
//           },
//         ]
//       },
//       ...                                  
//     ]
//   }

//   Ensure:
//   - The JSON is valid and contains **no markdown or extra text**.  
//   - The "coordinates" field contains number values for Singapore (approx lat: 1.35, lng: 103.8).
//   - Each day’s timeline has at least 3–5 entries.  
//   - The travel_date field uses the format "YYYY-MM-DD".`
//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: prompt,
//     });

//     // 1. Get the raw string response
//     let jsonString = response.text.trim();

//     // 2. Clean the string by removing Markdown code fences (```json or ```)
//     const markdownRegex = /```json\s*|```\s*/g;
//     jsonString = jsonString.replace(markdownRegex, '').trim();

//     // 3. Parse the cleaned string into a JS object
//     const jsonObject = JSON.parse(jsonString);

//     return jsonObject;
//   } catch (e) {
//     console.log(e.message);
//     throw new Error("Unable to generate content.");
//   }
// }

async function main(place, noOfDays, includeDining) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  try {
    // 1. Create a much stricter instruction for the dining preference
    const diningInstruction = includeDining 
        ? `Each activity MUST include a "dining_option" object with a specific local restaurant or cafe suggestion nearby.`
        : `CRITICAL: Do NOT suggest any dining or food options. The "dining_option" field for every activity MUST be strictly null. Focus only on attractions and sightseeing.`;

    const prompt = `
      Based on the area "${place}" in Singapore, generate a hidden gems itinerary featuring lesser-known attractions. 
      The itinerary MUST cover exactly ${noOfDays} day(s).
      
      Requirements:
      1. ${diningInstruction}
      2. Return the response strictly as a valid JSON object.
      3. The "coordinates" field MUST contain accurate latitude and longitude numbers for Singapore (approx lat: 1.3, lng: 103.8).

      JSON Structure:
      {
        "itinerary_name": "Hidden Gems of ${place}",
        "day_count": ${noOfDays},
        "days": [
          {
            "day": number,
            "itinerary": [
              {
                "time": "HH:MM AM/PM",
                "place_name": string,
                "coordinates": { "lat": number, "lng": number },
                "description": string,
                "hidden_gem_factor": string,
                "dining_option": { "location": string, "description": string } | null,
                "getting_there": string
              }
            ]
          }
        ]
      }

      Ensure:
      - Strictly return valid JSON. 
      - No markdown formatting (no \`\`\`json blocks).
      - No introductory or concluding text.
    `;

    // Keeping your original response fetching logic exactly as is
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Note: Using 2.5-flash as it is currently stable
      contents: prompt,
    });

    // 1. Get the raw string response
    let jsonString = response.text.trim();

    // 2. Clean the string by removing Markdown code fences (```json or ```)
    const markdownRegex = /```json\s*|```\s*/g;
    jsonString = jsonString.replace(markdownRegex, '').trim();

    // 3. Parse the cleaned string into a JS object
    const jsonObject = JSON.parse(jsonString);

    console.log(jsonObject);
    return jsonObject;
  } catch (e) {
    console.log(e.message);
    throw new Error("Unable to generate content.");
  }
}

module.exports = router;
