import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const Separator = () => (
        <span className="text-gray-300">|</span>
    );

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            
            <Link to="/" className="text-2xl font-bold text-green-600 tracking-tight">
                HireX
            </Link>

            <div className="flex items-center gap-4 text-m font-medium">

                <Link to="/jobs" className="text-gray-600 hover:text-green-600 transition">
                    Jobs
                </Link>

                <Separator />

                <Link to="/resume-analyzer" className="text-gray-600 hover:text-green-600 transition">
                    Resume Analyzer
                </Link>

                {user && (
                    <>
                        <Separator />

                        {user.role === 'recruiter' && (
                            <>
                                <Link to="/my-jobs" className="text-gray-600 hover:text-green-600 transition">
                                    Dashboard
                                </Link>

                                <Separator />

                                <Link to="/post-job" className="text-gray-600 hover:text-green-600 transition">
                                    Post Job
                                </Link>
                            </>
                        )}

                        {user.role === 'student' && (
                            <>
                                <Link to="/my-applications" className="text-gray-600 hover:text-green-600 transition">
                                    My Apps
                                </Link>
                            </>
                        )}

                        <Separator />

                        <Link to="/profile" className="text-gray-600 hover:text-green-600 transition">
                            Profile
                        </Link>

                        <Separator />

                        <button 
                            onClick={handleLogout} 
                            className="text-red-500 hover:text-red-600 transition font-semibold"
                        >
                            Logout
                        </button>
                    </>
                )}

                {!user && (
                    <>
                        <Separator />

                        <Link to="/login" className="text-gray-600 hover:text-green-600 transition">
                            Login
                        </Link>

                        <Link 
                            to="/signup" 
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;