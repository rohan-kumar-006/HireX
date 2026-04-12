const express = require('express');
const { postJob, getAllJobs, getJobById } = require('../controllers/job.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, postJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);

module.exports = router;
