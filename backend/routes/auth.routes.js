const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const express = require('express');
const {
    signup,
    login,
    googleLogin,
    getUser,
    updateProfile,
    uploadResume,
    setRole,
    getProfileById
} = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes('pdf')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.put('/set-role', auth, setRole);
router.get('/me', auth, getUser);
router.get('/user/:id', getProfileById);
router.put('/update', auth, updateProfile);

router.post('/upload-resume', auth, upload.single('resume'), uploadResume);

module.exports = router;






// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');
// const express = require('express');
// const { signup, login, googleLogin, getUser, updateProfile, uploadResume, setRole, getProfileById } = require('../controllers/auth.controller');
// const auth = require('../middleware/auth');
// const router = express.Router();

// console.log(`Cloudinary Config: Cloud Name = ${process.env.CLOUDINARY_CLOUD_NAME}, API Key = ${process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing'}`);

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: async (req, file) => {
//         return {
//             folder: 'resumes',
//             resource_type: 'auto',
//             public_id: Date.now() + '-' + file.originalname.split('.')[0],
//         };
//     },
// });

// const uploadMiddleware = (req, res, next) => {
//     upload.single('resume')(req, res, (err) => {
//         if (err) {
//             console.error("MULTER ERROR:", err.message);
//             return res.status(400).json({ error: err.message });
//         }
//         next();
//     });
// };

// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.includes('pdf')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only PDF files are allowed'), false);
//         }
//     }
// });

// router.post('/signup', signup);
// router.post('/login', login);
// router.post('/google', googleLogin);
// router.put('/set-role', auth, setRole);
// router.get('/me', auth, getUser);
// router.get('/user/:id', getProfileById);

// router.put('/update', auth, updateProfile);
// router.post('/upload-resume', auth, uploadMiddleware, uploadResume);

// module.exports = router;
