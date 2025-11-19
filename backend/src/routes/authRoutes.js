const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // Import login

// Endpoint Register
router.post('/register', register);

// Endpoint Login [BARU]
// URL: POST http://localhost:3001/api/v1/auth/login
router.post('/login', login);

module.exports = router;