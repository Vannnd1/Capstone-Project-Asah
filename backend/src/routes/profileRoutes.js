const express = require('express');
const router = express.Router();
const multer = require('multer');
const { updateProfile } = require('../controllers/profileController');

// Konfigurasi Multer (Simpan di memori sementara)
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint: PUT /api/v1/profile/update
// 'avatar' adalah nama field form-data dari frontend
router.put('/update', upload.single('avatar'), updateProfile);

module.exports = router;