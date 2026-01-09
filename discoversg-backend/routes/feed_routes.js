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
    const formattedRows = rows.map(row => ({
      postID: row.postID,
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
    const formattedRows = rows.map(row => ({
      guideID: row.guideID,
      title: row.title,
      description: row.description,
      user: {
        userName: row.userName,
        profilePic: row.profilePicUrl,
      },
      imageUrl: row.imageUrl,
      mediaUrl: row.mediaUrl,
      datePosted: row.datePosted,
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
  const { userID, postID } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM savedmedia WHERE userID = ? AND postID = ?', [userID, postID]);
    if (rows.length > 0) {
      const [result] = await pool.execute('DELETE FROM savedmedia WHERE userID = ? AND postID = ?', [userID, postID]);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Media unsaved successfully' });
      } else {
        res.status(404).json({ error: 'Media not found' });
      }
    } else {
      const [result] = await pool.execute('INSERT INTO savedmedia (userID, postID, savedAt) VALUES (?, ?, NOW())', [userID, postID]);
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

//Retrieve saved media
router.get('/saved-media', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM savedmedia INNER JOIN user ON user.userID = savedmedia.userID INNER JOIN post ON post.postID = savedmedia.postID');
    if (rows.length > 0) {
      const formattedRows = rows.map(row => ({
        savedMediaID: row.savedMediaID,
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
})


module.exports = router;