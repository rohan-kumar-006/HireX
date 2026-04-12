const express = require('express');
const multer = require('multer');
const { processResumeAnalysis } = require('../controllers/ai.controller');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/resume-analyze', auth, upload.single('resume'), processResumeAnalysis);

module.exports = router;
