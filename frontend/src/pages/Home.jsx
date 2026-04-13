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

    return (
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
                <Link 
                    to="/chat" 
                    className="fixed bottom-10 right-10 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all transform hover:scale-110 flex items-center gap-2"
                >

                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="font-bold">My Chats</span>
                </Link>
            <h1 className="text-6xl font-serif font-medium text-gray-900 mb-6">

                Discover the ideal match for <br /> Professional needs.
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                HireX uses AI to match your resume with the best jobs. 
                Get ranked based on your skills and missing gaps.
            </p>
            
            <div className="flex justify-center space-x-4 mb-20">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm max-w-2xl w-full">
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
                        className="bg-black text-white px-8 py-4 font-medium"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* <div className="text-gray-500">
                Popular: <span className="underline cursor-pointer ml-2">Motion Artist</span>, <span className="underline cursor-pointer ml-2">Web Design</span>, <span className="underline cursor-pointer ml-2">Illustrator</span>
            </div> */}
        </div>
    );
};

export default Home;
