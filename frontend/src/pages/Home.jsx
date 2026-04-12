import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
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

            <div className="text-gray-500">
                Popular: <span className="underline cursor-pointer ml-2">Motion Artist</span>, <span className="underline cursor-pointer ml-2">Web Design</span>, <span className="underline cursor-pointer ml-2">Illustrator</span>
            </div>
        </div>
    );
};

export default Home;
