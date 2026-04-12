const multer = require('multer');
const express = require('express');
const path = require('path');
const { signup, login, googleLogin, getUser, updateProfile, uploadResume } = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const router = express.Router();

// Multer Storage for Local Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', auth, getUser);
router.put('/update', auth, updateProfile);
router.post('/upload-resume', auth, upload.single('resume'), uploadResume);

module.exports = router;
