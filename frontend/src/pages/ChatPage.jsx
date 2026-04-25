import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import io from 'socket.io-client';
import API from '../api';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    transports: ['websocket']
});

const ChatPage = () => {
    const { jobId, applicantId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    
    const { jobTitle, otherUserName, otherUserId } = location.state || {};

    const roomId = jobId && applicantId ? `${jobId}_${applicantId}` : null;
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await API.get('/chat/conversations');
                setConversations(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchConversations();
    }, [jobId, applicantId]);

    useEffect(() => {
        if (!roomId) return;

        API.get(`/chat/${roomId}`)
            .then(res => setMessages(res.data))
            .catch(err => console.log(err));

        socket.emit('joinRoom', { roomId });

        socket.on('receiveMessage', (message) => {
            if (message.jobId === jobId) {
                 setMessages(prev => [...prev, message]);
            }
            API.get('/chat/conversations').then(res => setConversations(res.data));
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [roomId, jobId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !roomId) return;

        const messageData = {
            senderId: user?.id || user?._id,
            receiverId: otherUserId || (user.role === 'recruiter' ? applicantId : conversations.find(c => c.jobId === jobId)?.otherUserId), 
            jobId,
            text: input,
            roomId,
            timestamp: new Date()
        };

        socket.emit('sendMessage', messageData);
        setInput('');
    };

    return (
        <div className="max-w-7xl mx-auto h-[85vh] flex bg-white border rounded-xl overflow-hidden shadow-2xl mt-6">
            
            <div className="w-1/3 border-r bg-gray-50 flex flex-col">
                <div className="p-4 border-b bg-white">
                    <h2 className="text-xl font-bold text-gray-800">My Chats</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <p className="p-4 text-gray-500">Loading chats...</p>
                    ) : conversations.length > 0 ? (
                        conversations.map((conv, i) => (
                            <Link 
                                key={i}
                                to={`/chat/${conv.jobId}/${user.role === 'recruiter' ? conv.otherUserId : user.id || user._id}`}
                                state={{ 
                                    jobTitle: conv.jobTitle, 
                                    otherUserName: conv.otherUserName, 
                                    otherUserId: conv.otherUserId 
                                }}
                                className={`block p-4 border-b hover:bg-green-50 transition ${
                                    jobId === conv.jobId && (applicantId === conv.otherUserId || applicantId === (user.id || user._id)) 
                                    ? 'bg-green-100 border-l-4 border-l-green-600' 
                                    : 'bg-white'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900">{conv.otherUserName}</h3>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(conv.lastDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-green-600 font-medium mb-1 truncate">{conv.jobTitle}</p>
                                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                            </Link>
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-400 italic">No recent chats</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-white">
                {roomId ? (
                    <>
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center shadow-sm">
                            <div>
                                <h2 className="font-bold text-lg text-gray-800">{otherUserName || 'Chat'}</h2>
                                <p className="text-xs text-green-600 font-bold">{jobTitle || 'Active Job'}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.senderId === (user.id || user._id) ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                                        m.senderId === (user.id || user._id) 
                                            ? 'bg-green-600 text-white rounded-br-none' 
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                    }`}>
                                        <p className="text-sm leading-relaxed">{m.text}</p>
                                        <p className={`text-[10px] mt-1 opacity-70 ${m.senderId === (user.id || user._id) ? 'text-right' : 'text-left'}`}>
                                            {new Date(m.createdAt || m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t bg-white flex gap-3 items-center">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Write your message..."
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                            />
                            <button 
                                onClick={handleSend}
                                className="bg-green-600 text-white p-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition transform active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/20">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium">Select a conversation to start chatting</p>
                        <p className="text-sm">Ongoing chats will appear on the left sidebar</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
