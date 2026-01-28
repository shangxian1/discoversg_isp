const express = require("express");
const router = express.Router();
const db = require("../database");

// ✅ quick test
router.get("/ping", (req, res) => res.send("favourites ok"));

// ✅ get favourite IDs for user
router.get("/:userId/ids", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.execute(
      "SELECT activityID FROM favourite_activity WHERE userID = ?",
      [userId]
    );
    res.json(rows.map((r) => r.activityID));
  } catch (err) {
    console.error("GET fav ids error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ toggle favourite
router.post("/toggle", async (req, res) => {
  try {
    const userID = req.body.userID ?? req.body.userId;
    const activityID = req.body.activityID ?? req.body.activityId;

    if (!userID || !activityID) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [rows] = await db.execute(
      "SELECT 1 FROM favourite_activity WHERE userID=? AND activityID=? LIMIT 1",
      [userID, activityID]
    );

    if (rows.length > 0) {
      await db.execute(
        "DELETE FROM favourite_activity WHERE userID=? AND activityID=?",
        [userID, activityID]
      );
      return res.json({ favourited: false });
    } else {
      await db.execute(
        "INSERT INTO favourite_activity (userID, activityID) VALUES (?,?)",
        [userID, activityID]
      );
      return res.json({ favourited: true });
    }
  } catch (err) {
    console.error("POST toggle fav error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;