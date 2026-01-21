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

  const saltRounds = 10;

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

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const [result] = await global.db.execute(
      'INSERT INTO user (roleID, userName, userPassword, userEmail, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [1, username, passwordHash, email]
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
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const [rows] = await global.db.execute(
      'SELECT userID, userName, profilePicUrl, role.roleName, userEmail, userDescription, userPassword FROM user JOIN role ON role.roleID = user.roleID WHERE userName = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = rows[0];
    const storedPassword = user.userPassword;
    const looksBcrypt = typeof storedPassword === 'string' && storedPassword.startsWith('$2');

    let passwordOk = false;
    if (looksBcrypt) {
      passwordOk = await bcrypt.compare(password, storedPassword);
    } else {
      // Backwards compatibility: if older accounts stored plaintext, allow login once
      // and migrate to bcrypt immediately.
      passwordOk = storedPassword === password;
      if (passwordOk) {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        await global.db.execute(
          'UPDATE user SET userPassword = ?, updatedAt = NOW() WHERE userID = ?',
          [passwordHash, user.userID]
        );
      }
    }

    if (!passwordOk) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.userID,
        name: user.userName,
        role: user.roleName,
        email: user.userEmail,
        profilePicUrl: user.profilePicUrl,
        userDescription: user.userDescription
      }
    });
  } catch (error) {
    console.log(error)
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
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(userPassword, saltRounds);
      query = 'UPDATE user SET userName = ?, userEmail = ?, userPassword = ?, profilePicUrl = ?, userDescription = ?, updatedAt = NOW() WHERE userID = ?';
      params = [userName, userEmail, passwordHash, profilePicUrl, description, userID];
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