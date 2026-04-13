import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student'
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/signup', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Account created successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
        }
    };


    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                        type="email" 
                        className="input-field" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input 
                        type="password" 
                        className="input-field" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select 
                        className="input-field" 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                    </select>
                </div>
                <button type="submit" className="w-full btn-primary py-3">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
