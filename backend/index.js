const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ quiet: true });

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const appRoutes = require('./routes/application.routes');
const aiRoutes = require('./routes/ai.routes');
const Message = require('./models/Message');
const auth = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', appRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/chat/conversations', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        })
            .populate('senderId', 'name')
            .populate('receiverId', 'name')
            .populate('jobId', 'title')
            .sort({ createdAt: -1 });

        const conversations = [];
        const seen = new Set();

        messages.forEach(m => {
            if (!m.jobId) return;

            const otherUser = m.senderId._id.toString() === userId ? m.receiverId : m.senderId;
            const key = `${m.jobId._id}_${otherUser._id}`;

            if (!seen.has(key)) {
                conversations.push({
                    jobId: m.jobId._id,
                    jobTitle: m.jobId.title,
                    otherUserId: otherUser._id,
                    otherUserName: otherUser.name,
                    lastMessage: m.text,
                    lastDate: m.createdAt
                });
                seen.add(key);
            }
        });

        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching conversations" });
    }
});

app.get('/api/chat/:roomId', auth, async (req, res) => {
    try {
        const { roomId } = req.params;
        const [jobId, applicantId] = roomId.split('_');

        const currentUserId = req.user.id;
        if (currentUserId !== applicantId && currentUserId !== (await Message.findOne({ jobId })).receiverId.toString()) {
        }

        const messages = await Message.find({ jobId }).sort({ createdAt: 1 });
        const filteredMessages = messages.filter(m =>
            (m.senderId.toString() === applicantId || m.receiverId.toString() === applicantId)
        );
        res.json(filteredMessages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
    }
});

io.on('connection', (socket) => {
    // console.log('User connected:', socket.id);

    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
        // console.log(`User joined room: ${roomId}`);
    });

    socket.on('sendMessage', async (data) => {
        try {
            const { senderId, receiverId, jobId, text, roomId } = data;

            if (!senderId) {
                console.log("Blocked unauthenticated socket message");
                return;
            }

            if (!receiverId || !jobId || !text) {
                console.error("Missing required fields");
                return;
            }


            const newMessage = new Message({
                senderId,
                receiverId,
                jobId,
                text
            });

            await newMessage.save();

            const targetRoomId = roomId;
            io.to(targetRoomId).emit('receiveMessage', newMessage);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on('disconnect', () => {
    });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('DB Error:', err));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
