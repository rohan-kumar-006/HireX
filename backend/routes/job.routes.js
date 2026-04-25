const { postJob, getAllJobs, getJobById, getMyJobs, closeJob } = require('../controllers/job.controller');
const { getApplicants } = require('../controllers/application.controller');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, postJob);
router.get('/', getAllJobs);
router.get('/my', auth, getMyJobs);
router.get('/:id', getJobById);
router.put('/:id/close', auth, closeJob);
router.get('/:jobId/applicants', auth, getApplicants);

module.exports = router;
