const express = require('express');
const { signup, login, googleLogin, getUser, updateProfile } = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', auth, getUser);
router.put('/update', auth, updateProfile);

module.exports = router;
