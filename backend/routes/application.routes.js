const express = require('express');
const multer = require('multer');
const { applyToJob, uploadResume, getApplicants, getMyApplications } = require('../controllers/application.controller');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/apply/:jobId', auth, applyToJob);
router.post('/resume', auth, upload.single('resume'), uploadResume);
router.get('/job/:jobId', auth, getApplicants);
router.get('/my-apps', auth, getMyApplications);

module.exports = router;
