const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pdf = require('pdf-parse');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

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
        const { token } = req.body;
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
                profile: { googleId: sub }
            });
            await user.save();
        }

        const roleMissing = !user.role;
        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');

        res.json({
            token: jwtToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            roleMissing
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Google auth error' });
    }
};

const setRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.user.id;

        if (!['student', 'recruiter'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role;
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');

        res.json({ message: 'Role updated', user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    } catch (err) {
        res.status(500).json({ message: 'Error setting role' });
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
        const { id } = req.user;
        const user = await User.findById(id);
        const {
            name, bio, college, skills, linkedin, portfolio,
            companyName, companyDescription, ongoingProjects
        } = req.body;

        user.name = name || user.name;
        if (user.role === 'student') {
            user.profile.bio = bio;
            user.profile.college = college;
            user.profile.linkedin = linkedin;
            user.profile.portfolio = portfolio;
            user.profile.skills = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []);
        } else if (user.role === 'recruiter') {
            user.profile.companyName = companyName;
            user.profile.companyDescription = companyDescription;
            user.profile.ongoingProjects = ongoingProjects;
            user.profile.linkedin = linkedin;
        }

        await user.save();
        res.json({ message: 'Profile updated', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

const axios = require('axios');

const uploadResume = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const pdfData = await pdf(req.file.buffer);

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: 'resumes'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            stream.end(req.file.buffer);
        });

        const user = await User.findByIdAndUpdate(req.user.id, {
            'profile.resume': result.secure_url,
            'profile.resumeText': pdfData.text,
            'profile.resumeName': req.file.originalname
        }, { new: true });

        res.json({
            message: 'Resume uploaded successfully',
            user
        });

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({
            message: 'Error uploading resume',
            error: err.message
        });
    }
};

const getProfileById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { signup, login, googleLogin, getUser, updateProfile, uploadResume, setRole, getProfileById };


