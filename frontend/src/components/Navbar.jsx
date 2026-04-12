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

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-green-600">HireX</Link>
            <div className="space-x-4 flex items-center">
                <Link to="/jobs" className="text-gray-600 hover:text-green-600">Jobs</Link>
                <Link to="/resume-analyzer" className="text-gray-600 hover:text-green-600">Resume Analyzer</Link>
                {user ? (
                    <>
                        {user.role === 'recruiter' && (
                            <>
                                <Link to="/my-jobs" className="text-gray-600 hover:text-green-600">My Jobs</Link>
                                <Link to="/post-job" className="text-gray-600 hover:text-green-600">Post Job</Link>
                            </>
                        )}
                        {user.role === 'student' && (
                            <Link to="/my-applications" className="text-gray-600 hover:text-green-600">My Apps</Link>
                        )}
                        <Link to="/profile" className="text-gray-600 hover:text-green-600">Profile</Link>
                        <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-green-600">Login</Link>
                        <Link to="/signup" className="btn-primary">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
