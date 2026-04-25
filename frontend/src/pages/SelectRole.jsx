import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';

const SelectRole = () => {
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!role) return toast.error('Please select a role');

        setLoading(true);
        try {
            const { data } = await API.put('/auth/set-role', { role });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            toast.success('Role set successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to set role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-gray-100 rounded-2xl shadow-2xl text-center">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">One last thing!</h2>
            <p className="text-gray-500 mb-8 text-sm">Please select your role to continue</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div 
                        onClick={() => setRole('student')}
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            role === 'student' 
                            ? 'border-green-600 bg-green-50' 
                            : 'border-gray-100 hover:border-green-200'
                        }`}
                    >
                        <div className="text-3xl mb-2">🎓</div>
                        <p className={`font-bold ${role === 'student' ? 'text-green-700' : 'text-gray-600'}`}>Student</p>
                    </div>

                    <div 
                        onClick={() => setRole('recruiter')}
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            role === 'recruiter' 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-100 hover:border-blue-200'
                        }`}
                    >
                        <div className="text-3xl mb-2">💼</div>
                        <p className={`font-bold ${role === 'recruiter' ? 'text-blue-700' : 'text-gray-600'}`}>Recruiter</p>
                    </div>
                </div>

                <button 
                    disabled={loading || !role}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                        role 
                        ? 'bg-green-600 hover:bg-green-700 transform hover:scale-[1.02]' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    {loading ? 'Setting up...' : 'Finish Setup'}
                </button>
            </form>
        </div>
    );
};

export default SelectRole;
