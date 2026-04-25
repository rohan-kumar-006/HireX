import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import API from '../api';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student'
    });
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(formData.password)) {
            toast.error("Password must be at least 8 characters and include uppercase, lowercase, and a number");
            return;
        }

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

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { data } = await API.post('/auth/google', {
                token: credentialResponse.credential,
                role: formData.role // Pass selected role
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.roleMissing) {
                navigate('/select-role');
            } else {
                toast.success('Login successful');
                navigate('/');
            }

        } catch (error) {
            toast.error('Google auth failed');
        }
    };



    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                {/* ... existing fields ... */}
                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        className="input-field"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        className="input-field"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        className="input-field"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    {formData.password && !validatePassword(formData.password) && (
                        <p className="text-xs text-red-500 mt-1">
                            Must include 8+ chars, uppercase, lowercase, and number
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                        className="input-field"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                    </select>
                </div>
                <button type="submit" className="w-full btn-primary py-3">Sign Up</button>
            </form>

            <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <div className="px-3 text-gray-500 text-sm">OR</div>
                <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="flex justify-center flex-col items-center gap-2">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google Auth Failed')}
                    useOneTap
                />
            </div>

        </div>
    );
};

export default Signup;
