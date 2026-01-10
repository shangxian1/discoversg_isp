const express = require('express');
const router = express.Router();
const cors = require('cors');
require('../database');
const pool = global.db;

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Retrieve all videos (for all users)
router.get('/local-videos', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM post JOIN user ON post.userID = user.userID JOIN role ON role.roleID = user.roleID');
    const [savedMediaID] = await pool.execute('SELECT mediaID FROM savedmedia');
    const result = savedMediaID.map(item => item.mediaID);

    const formattedRows = rows.map(row => ({
      postID: row.postID,
      savedMediaCode: row.postCode,
      title: row.title,
      description: row.description,
      user: {
        userName: row.userName,
        profilePic: row.profilePicUrl,
        role: row.roleName,
      },
      addressName: row.addressName,
      fullAddress: row.fullAddress,
      mediaUrl: row.mediaUrl,
      noOfLikes: row.noOfLikes,
      datePosted: row.datePosted,
      isSaved: result.includes(row.postCode)
    }));

    res.status(200).json(formattedRows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

//Retrieve all videos based on Content Creator ID
router.get('/local-videos/:creatorID', async (req, res) => {
  const { creatorID } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM post p WHERE userID = ?', [creatorID]);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(200).json({ message: "No travel videos belonging to this creator" })
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


//Retrieve all planner guides (for all users)
router.get('/planner-guides', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM guide JOIN user ON guide.userID = user.userID');
    const [savedMediaID] = await pool.execute('SELECT mediaID FROM savedmedia');
    const result = savedMediaID.map(item => item.mediaID);
    const formattedRows = rows.map(row => ({
      guideID: row.guideID,
      savedMediaCode: row.guideCode,
      title: row.title,
      description: row.description,
      user: {
        userName: row.userName,
        profilePic: row.profilePicUrl,
      },
      imageUrl: row.imageUrl,
      mediaUrl: row.mediaUrl,
      datePosted: row.datePosted,
      isSaved: result.includes(row.guideCode)
    }));
    res.status(200).json(formattedRows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

//Retrieve all planner guides based on Content Creator ID
router.get('/planner-guides/:creatorID', async (req, res) => {
  const { creatorID } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM guide p WHERE userID = ?', [creatorID]);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(200).json({ message: "No planner guides belonging to this creator" })
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

//Save or unsave media
router.post('/save-unsave-media', async (req, res) => {
  const { userID, mediaID } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM savedmedia WHERE userID = ? AND mediaID = ?', [userID, mediaID]);
    if (rows.length > 0) {
      const [result] = await pool.execute('DELETE FROM savedmedia WHERE userID = ? AND mediaID = ?', [userID, mediaID]);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Media unsaved successfully' });
      } else {
        res.status(404).json({ error: 'Media not found' });
      }
    } else {
      const [result] = await pool.execute('INSERT INTO savedmedia (userID, mediaID, savedAt) VALUES (?, ?, NOW())', [userID, mediaID]);
      res.status(200).json({
        message: 'Media saved successfully',
        savedMediaID: result.insertId
      })
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

//Retrieve saved videos
router.get('/saved-videos', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT savedMediaID, mediaID, title, mediaUrl, noOfLikes, user.userName, user.profilePicUrl FROM savedmedia INNER JOIN post p ON p.postCode = savedmedia.mediaID INNER JOIN user ON user.userID = p.userID');
    if (rows.length > 0) {
      const formattedRows = rows.map(row => ({
        savedMediaID: row.savedMediaID,
        savedMediaCode: row.mediaID,
        title: row.title,
        user: {
          userName: row.userName,
          profilePic: row.profilePicUrl
        },
        mediaUrl: row.mediaUrl,
        noOfLikes: row.noOfLikes,
      }));
      res.status(200).json(formattedRows);
    } else {
      res.status(200).json({ message: "No saved media found." })
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

router.get('/saved-guides', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT savedMediaID, mediaID, title, mediaUrl, imageUrl, user.userName, user.profilePicUrl FROM savedmedia INNER JOIN guide g ON g.guideCode = savedmedia.mediaID INNER JOIN user ON user.userID = g.userID');
    if (rows.length > 0) {
      const formattedRows = rows.map(row => ({
        savedMediaID: row.savedMediaID,
        savedMediaCode: row.mediaID,
        title: row.title,
        user: {
          userName: row.userName,
          profilePic: row.profilePicUrl
        },
        mediaUrl: row.mediaUrl,
        imageUrl: row.imageUrl
      }));
      res.status(200).json(formattedRows);
    } else {
      res.status(200).json({ message: "No saved media found." })
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


module.exports = router;