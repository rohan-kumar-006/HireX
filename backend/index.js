const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({quiet:true});

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const appRoutes = require('./routes/application.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', appRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hirex';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('DB Error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
