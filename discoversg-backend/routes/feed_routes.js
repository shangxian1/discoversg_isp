const express = require('express');
const router = express.Router();
const cors = require('cors');
require('../database');
const pool = global.db;

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Retrieve all videos (for all users)
router.get('/local-videos{/:userID}', async (req, res) => {
  const { userID } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM post JOIN user ON post.userID = user.userID JOIN role ON role.roleID = user.roleID');
    const [savedMediaID] = await pool.execute('SELECT mediaID FROM savedmedia WHERE userID = ?', [userID]);
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

//Retrieve all planner guides (for all users)
router.get('/planner-guides{/:userID}', async (req, res) => {
  const { userID } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM guide JOIN user ON guide.userID = user.userID');
    const [savedMediaID] = await pool.execute('SELECT mediaID FROM savedmedia WHERE userID = ?', [userID]);
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

//Retrieve saved videos based on logged in user
router.get('/saved-videos/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
    const [rows] = await pool.execute('SELECT savedMediaID, mediaID, title, mediaUrl, noOfLikes, user.userName, user.profilePicUrl FROM savedmedia INNER JOIN post p ON p.postCode = savedmedia.mediaID INNER JOIN user ON user.userID = p.userID WHERE savedMedia.userID = ?', [userID]);
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

//Retrieve saved guides based on logged in user
router.get('/saved-guides/:userID', async (req, res) => {
  const { userID } = req.params;
  try {
    const [rows] = await pool.execute('SELECT savedMediaID, mediaID, title, mediaUrl, imageUrl, user.userName, user.profilePicUrl FROM savedmedia INNER JOIN guide g ON g.guideCode = savedmedia.mediaID INNER JOIN user ON user.userID = g.userID WHERE savedmedia.userID = ?', [userID]);
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
});

//Retrieve media based on Content Creator ID
router.get('/analytics/:creatorID', async (req, res) => {
  const { creatorID } = req.params;
  try {
    const [creatorPosts] = await pool.execute('SELECT * FROM post WHERE userID = ?', [creatorID]);
    const [[{ totalLikes }]] = await pool.execute('SELECT SUM(noOfLikes) AS totalLikes FROM post WHERE userID = ?', [creatorID]);
    const [creatorGuides] = await pool.execute('SELECT * FROM guide WHERE userID = ?', [creatorID]);

    const [savedMediaID] = await pool.execute('SELECT mediaID FROM savedmedia');
    const result = savedMediaID.map(item => item.mediaID);

    const formattedVideoRows = creatorPosts.map(row => ({
      postID: row.postID,
      savedMediaCode: row.postCode,
      title: row.title,
      description: row.description,
      addressName: row.addressName,
      fullAddress: row.fullAddress,
      mediaUrl: row.mediaUrl,
      noOfLikes: row.noOfLikes,
      datePosted: row.datePosted,
      noOfSaves: result.filter(id => id == row.postCode).length
    }));

    const formattedGuideRows = creatorGuides.map(row => ({
      guideID: row.guideID,
      savedMediaCode: row.guideCode,
      title: row.title,
      description: row.description,
      imageUrl: row.imageUrl,
      mediaUrl: row.mediaUrl,
      datePosted: row.datePosted,
      noOfSaves: result.filter(id => id == row.guideCode).length
    }));

    if (creatorPosts.length > 0 || creatorGuides.length > 0) {
      res.status(200).json({
        totalLikes,
        "local-videos": formattedVideoRows,
        "guides": formattedGuideRows
      });
    } else {
      res.status(200).json({ message: "No media belonging to this creator" })
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// Retrieve local video based on media code (For edit media)
router.get('/local-video/:mediaCode', async (req, res) => {
  const { mediaCode } = req.params;

  try {
    const [result] = await pool.execute('SELECT * FROM post WHERE postCode = ?', [mediaCode]);
    if (result.length == 1) {
      const selectedVideo = result[0];
      const isYoutube = selectedVideo.mediaUrl.includes('https://www.youtube.com');
      const isTiktok = selectedVideo.mediaUrl.includes('https://www.tiktok.com');
      const mediaID = isTiktok || isYoutube ? retrieveMediaID(selectedVideo.mediaUrl) : null;
      const mediaUrl = !isTiktok && !isYoutube ? selectedVideo.mediaUrl : null;
      const date = new Date(selectedVideo.datePosted).toISOString().split('T')[0];
      res.status(200).json({
        mediaCode: selectedVideo.postCode,
        title: selectedVideo.title,
        location: selectedVideo.addressName,
        address: selectedVideo.fullAddress,
        description: selectedVideo.description,
        likes: selectedVideo.noOfLikes,
        date: date,
        videoID: mediaID,
        ownVideoUrl: mediaUrl,
        mediaType: isYoutube ? 'youtube' : 'tiktok'
      })
    } else {
      res.status(404).json({ message: `No posts found under media code ${mediaCode}` });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Retrieve planner guide based on media code (For edit media)
router.get('/planner-guide/:mediaCode', async (req, res) => {
  const { mediaCode } = req.params;

  try {
    const [result] = await pool.execute('SELECT * FROM guide WHERE guideCode = ?', [mediaCode]);
    if (result.length == 1) {
      const selectedGuide = result[0];
      const date = new Date(selectedGuide.datePosted).toISOString().split('T')[0];
      res.status(200).json({
        mediaCode: selectedGuide.guideCode,
        title: selectedGuide.title,
        description: selectedGuide.description,
        date: date,
        imageUrl: selectedGuide.imageUrl,
        mediaUrl: selectedGuide.mediaUrl,
      })
    } else {
      res.status(404).json({ message: `No guides found under media code ${mediaCode}` });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Add local video
router.post('/add/local-video', async (req, res) => {
  const { title, description, address, fullAddress, noOfLikes, ownVideoUrl, externalVideoID, mediaType, datePosted, userID } = req.body;
  try {
    const [result] = await pool.execute('SELECT postCode FROM post ORDER BY postID DESC LIMIT 1');
    if (result.length == 1) {
      const lastVideoCode = result[0].postCode;
      const newViewCode = incrementMediaCode(lastVideoCode);

      if (ownVideoUrl) {
        const [result] = await pool.execute('INSERT INTO post(postCode, userID, title, description, addressName, fullAddress, noOfLikes, mediaUrl, datePosted, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', [newViewCode, userID, title, description, address, fullAddress, noOfLikes, ownVideoUrl, datePosted]);
        if (result.affectedRows > 0) {
          res.status(200).json({ success: true, message: 'Local Video Uploaded Successfully!' });
        }
      }

      else if (externalVideoID) {
        const [checkMedia] = await pool.execute('SELECT mediaUrl FROM post');
        const exists = checkMedia.some(media => retrieveMediaID(media.mediaUrl) === externalVideoID);
        if (exists) {
          res.status(404).json({ success: false, message: 'Video already exists, upload a different video' })
        } else {
          if (mediaType == 'tiktok') {
            const tikTokUrl = `https://www.tiktok.com/embed/v2/${externalVideoID}`;
            const [result] = await pool.execute('INSERT INTO post(postCode, userID, title, description, addressName, fullAddress, noOfLikes, mediaUrl, datePosted, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', [newViewCode, userID, title, description, address, fullAddress, noOfLikes, tikTokUrl, datePosted]);
            if (result.affectedRows > 0) {
              res.status(200).json({ success: true, message: 'Local Video Uploaded Successfully!' });
            }
          } else {
            const youtubeUrl = `https://www.youtube.com/embed/${externalVideoID}`;
            const [result] = await pool.execute('INSERT INTO post(postCode, userID, title, description, addressName, fullAddress, noOfLikes, mediaUrl, datePosted, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', [newViewCode, userID, title, description, address, fullAddress, noOfLikes, youtubeUrl, datePosted]);
            if (result.affectedRows > 0) {
              res.status(200).json({ success: true, message: 'Local Video Uploaded Successfully!' });
            } else {
              res.status(500).json({ error: 'Internal Server Error, unable to add local video' });
            }
          }
        }
      }
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add travel guide
router.post('/add/travel-guide', async (req, res) => {
  const { title, description, imageUrl, mediaUrl, datePosted, userID } = req.body;
  try {
    const [rows] = await pool.execute('SELECT guideCode FROM guide ORDER BY guideID DESC LIMIT 1');
    if (rows.length == 1) {
      const lastGuideCode = rows[0].guideCode;
      const newViewCode = incrementMediaCode(lastGuideCode);

      const [result] = await pool.execute('INSERT INTO guide(guideCode, userID, title, description, imageUrl, mediaUrl, datePosted, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', [newViewCode, userID, title, description, imageUrl, mediaUrl, datePosted]);
      if (result.affectedRows > 0) {
        res.status(200).json({ success: true, message: 'Travel Guide Uploaded Successfully!' });
      } else {
        res.status(500).json({ message: 'Internal Server Error, unable to add guide.' });
      }
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// Edit local video
router.post('/edit/local-video', async (req, res) => {
  const { postCode, title, description, address, fullAddress, noOfLikes, ownVideoUrl, externalVideoID, mediaType, datePosted } = req.body;

  if (ownVideoUrl) {
    const [result] = await pool.execute('UPDATE post SET title = ?, description = ?, addressName = ?, fullAddress = ?, noOfLikes = ?, mediaUrl = ?, datePosted = ?, updatedAt = NOW() WHERE postCode = ?', [title, description, address, fullAddress, noOfLikes, ownVideoUrl, datePosted, postCode]);
    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: `Local Video (ID: ${postCode}) has been edited successfully!` });
    }
  }

  if (externalVideoID) {
    const [checkMedia] = await pool.execute('SELECT mediaUrl FROM post WHERE NOT postCode = ?', [postCode]);
    const exists = checkMedia.some(media => retrieveMediaID(media.mediaUrl) === externalVideoID);
    if (exists) {
      res.status(404).json({ success: false, message: 'Video already exists, upload a different video' })
    } else {
      if (mediaType == 'tiktok') {
        const tikTokUrl = `https://www.tiktok.com/embed/v2/${externalVideoID}`;
        const [result] = await pool.execute('UPDATE post SET title = ?, description = ?, addressName = ?, fullAddress = ?, noOfLikes = ?, mediaUrl = ?, datePosted = ?, updatedAt = NOW() WHERE postCode = ?', [title, description, address, fullAddress, noOfLikes, tikTokUrl, datePosted, postCode]);
        if (result.affectedRows > 0) {
          res.status(200).json({ success: true, message: `Local Video (ID: ${postCode}) has been edited successfully!` });
        }
      } else {
        const youtubeUrl = `https://www.youtube.com/embed/${externalVideoID}`;
        const [result] = await pool.execute('UPDATE post SET title = ?, description = ?, addressName = ?, fullAddress = ?, noOfLikes = ?, mediaUrl = ?, datePosted = ?, updatedAt = NOW() WHERE postCode = ?', [title, description, address, fullAddress, noOfLikes, youtubeUrl, datePosted, postCode]);
        if (result.affectedRows > 0) {
          res.status(200).json({ success: true, message: `Local Video (ID: ${postCode}) has been edited successfully!` });
        }
      }
    }
  }
})

// Edit travel guide
router.post('/edit/travel-guide', async (req, res) => {
  const { guideCode, title, description, imageUrl, mediaUrl, datePosted } = req.body;
  try {
    const [result] = await pool.execute('UPDATE guide SET title = ?, description = ?, imageUrl = ?, mediaUrl = ?, datePosted = ?, updatedAt = NOW() WHERE guideCode = ?', [title, description, imageUrl, mediaUrl, datePosted, guideCode]);
    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: `Travel Guide (ID: ${guideCode}) has been edited successfully!` });
    } else {
      res.status(500).json({ message: 'Internal Server Error, unable to edit guide.' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Delete local video based on code
router.delete('/delete/local-video/:mediaCode', async (req, res) => {
  const { mediaCode } = req.params;

  try {
    await pool.execute('DELETE FROM post WHERE postCode = ?', [mediaCode]);
    res.status(200).json({ message: `Local Video (ID: ${mediaCode}) deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
})

// Delete travel guide based on code
router.delete('/delete/travel-guide/:mediaCode', async (req, res) => {
  const { mediaCode } = req.params;

  try {
    await pool.execute('DELETE FROM guide WHERE guideCode = ?', [mediaCode]);
    res.status(200).json({ message: `Travel Guide (ID: ${mediaCode}) deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
})

function incrementMediaCode(currentCode) {
  // Separate the letter from the numbers
  const prefix = currentCode.slice(0, 1);
  const numericPart = parseInt(currentCode.slice(1));
  const nextNumericPart = (numericPart + 1).toString().padStart(3, '0');

  return prefix + nextNumericPart;
}

function retrieveMediaID(mediaLink) {
  const regex = /embed\/(?:v2\/)?([a-zA-Z0-9_-]+)/;
  const match = mediaLink.match(regex);

  return match[1];
}




module.exports = router;