import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import API from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Login successful');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { data } = await API.post('/auth/google', { 
                token: credentialResponse.credential 
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
            <h2 className="text-2xl font-bold text-center mb-6">Login to HireX</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                        type="email" 
                        className="input-field" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input 
                        type="password" 
                        className="input-field" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Login</button>
            </form>

            <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <div className="px-3 text-gray-500 text-sm">OR</div>
                <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google Login Failed')}
                    useOneTap
                />
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account? <span onClick={() => navigate('/signup')} className="text-green-600 cursor-pointer">Sign Up</span>
            </p>
        </div>
    );
};

export default Login;
