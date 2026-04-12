const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pdf = require('pdf-parse');
const fs = require('fs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
        res.status(201).json({ token, user: { id: user._id, name, email, role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { token, role } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, email, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                role: role || 'student',
                profile: { googleId: sub }
            });
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
        res.json({ token: jwtToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Google auth error' });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, bio, college, skills, experience } = req.body;
        
        const updateData = {
            name,
            'profile.bio': bio,
            'profile.college': college,
            'profile.experience': experience,
            'profile.skills': Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())
        };

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        res.json({ message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};

const uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const resumePath = `/uploads/${req.file.filename}`;
        
        // Extract text from PDF
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdf(dataBuffer);
        const extractedText = pdfData.text;
        await User.findByIdAndUpdate(req.user.id, {
            'profile.resume': resumePath,
            'profile.resumeText': extractedText,
            'profile.resumeName': req.file.originalname
        });

        res.json({ message: 'Resume uploaded and text extracted successfully', resume: resumePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error uploading resume' });
    }
};

module.exports = { signup, login, googleLogin, getUser, updateProfile, uploadResume };
