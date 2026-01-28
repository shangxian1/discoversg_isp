const express = require('express');
const router = express.Router();
const cors = require('cors');
const bcrypt = require('bcrypt');
require('../database');

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//signup 
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: "Username, email, and password are required"
    });
  }

  const hasLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
    return res.status(400).json({
      success: false,
      message: "Password is too weak. It must have 8+ chars, uppercase, number, and symbol."
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
    const [result] = await global.db.execute(
      'INSERT INTO user (roleID, userName, userPassword, userEmail, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [1, username, hashedPassword, email]
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

// --- Auth Routes ---
// --- Updated Login Route in routes.js ---
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Fetch the user by username only
    const [rows] = await global.db.execute(
      `SELECT u.userID, u.userName, u.userPassword, u.profilePicUrl, u.userEmail, u.userDescription, r.roleName 
       FROM user u 
       JOIN role r ON r.roleID = u.roleID 
       WHERE u.userName = ?`,
      [username]
    );

    // 2. Check if user exists
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];

    // 3. Compare the submitted password with the hashed password from the DB
    const isMatch = await bcrypt.compare(password, user.userPassword);

    if (isMatch) {
      // 4. Success! Return user data (excluding the password)
      res.status(200).json({
        success: true,
        user: {
          id: user.userID,
          name: user.userName,
          role: user.roleName,
          email: user.userEmail,
          profilePicUrl: user.profilePicUrl,
          userDescription: user.userDescription,
          passLength: user.userPassword.length // Note: This is the hash length, not the original password length
        }
      });
    } else {
      // 5. Password does not match
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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