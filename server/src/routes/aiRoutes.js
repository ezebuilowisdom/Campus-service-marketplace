const express = require('express');
const { queryAssistant } = require('../controllers/aiController');

const router = express.Router();

router.post('/query', queryAssistant);

module.exports = router;
