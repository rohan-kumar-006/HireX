import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/jobs');
        }
    };

    const isRecruiter = user?.role === 'recruiter';

    return (
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
            {user && (
                <Link
                    to="/chat"
                    className="fixed bottom-6 right-6 bg-green-600 text-white p-3 rounded-full shadow-2xl hover:bg-green-700 transition-all transform hover:scale-110 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="font-bold">My Chats</span>
                </Link>
            )}

            <h1 className="text-6xl font-serif font-medium text-gray-900 mb-6 leading-tight">
                {isRecruiter 
                  ? "Find the right talent for your hiring needs." 
                  : <>Discover the ideal match for <br /> Professional needs.</>
                }
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                {isRecruiter 
                  ? "Find the best candidates, analyze skill gaps, and hire smarter."
                  : "See how well you match, identify skill gaps, and apply smarter."
                }
            </p>

            {isRecruiter ? (
                <div className="flex justify-center gap-4 mb-20">
                    <button 
                        onClick={() => navigate('/post-job')}
                        className="bg-green-600 text-white px-10 py-4 rounded-lg text-xl hover:bg-green-700 transition shadow-lg"
                    >
                        Post a New Job
                    </button>
                    <button 
                        onClick={() => navigate('/my-jobs')}
                        className="bg-white text-green-600 border-2 border-green-600 px-10 py-4 rounded-lg text-xl hover:bg-green-50 transition"
                    >
                        View Dashboard
                    </button>
                </div>
            ) : (
                <div className="flex justify-center space-x-4 mb-20">
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm max-w-2xl w-full focus-within:ring-2 focus-within:ring-green-500 transition">
                        <input
                            type="text"
                            placeholder="What job are you looking for?"
                            className="p-4 w-full outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-green-600 text-white px-8 py-4 font-medium hover:bg-green-700 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <h3 className="font-bold text-xl mb-2">{isRecruiter ? "Rank Candidates" : "AI Matching"}</h3>
                    <p className="text-gray-600">
                        {isRecruiter 
                          ? "Our AI ranks applicants based on how well their skills match your requirements." 
                          : "Get ranked based on your skills and see exactly what's missing from your resume."}
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <h3 className="font-bold text-xl mb-2">{isRecruiter ? "Resume Analysis" : "Easy Apply"}</h3>
                    <p className="text-gray-600">
                        {isRecruiter 
                          ? "Analyze resumes in seconds to identify the top talent instantly." 
                          : "Apply to jobs instantly with one click and track your status in real-time."}
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <h3 className="font-bold text-xl mb-2">Direct Chat</h3>
                    <p className="text-gray-600">
                        {isRecruiter 
                          ? "Start a direct conversation with promising candidates to speed up your hiring." 
                          : "Connect with recruiters to discuss opportunities and assignments."}
                    </p>
                </div>
            </div>
        </div>

    );
};

export default Home;
