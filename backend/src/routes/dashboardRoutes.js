const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController.js');

// Definisikan endpoint
// GET /api/v1/dashboard/:userId
router.get('/:userId', getDashboardData);

module.exports = router;