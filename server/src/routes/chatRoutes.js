const express = require('express');
const { getRooms, getMessages, sendMessage } = require('../controllers/chatController');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/rooms', requireAuth, getRooms);
router.get('/rooms/:roomId/messages', requireAuth, getMessages);
router.post('/messages', requireAuth, sendMessage);

module.exports = router;
