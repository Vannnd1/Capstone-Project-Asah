const express = require('express');
const router = express.Router();
const { recordActivity } = require('../controllers/activityController');

// POST /api/v1/activity/record
router.post('/record', recordActivity);

module.exports = router;