import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '', bio: '', college: '', skills: '', experience: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await API.get('/auth/me');
                setFormData({
                    name: data.name || '',
                    bio: data.profile?.bio || '',
                    college: data.profile?.college || '',
                    skills: data.profile?.skills?.join(', ') || '',
                    experience: data.profile?.experience || ''
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put('/auth/update', formData);
            alert('Profile updated successfully');
            navigate('/profile');
        } catch (err) {
            alert('Update failed');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white border rounded-lg mt-10 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-green-700">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">College</label>
                    <input className="input-field" value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Experience (Years or Description)</label>
                    <input className="input-field" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                    <input className="input-field" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Bio / Description</label>
                    <textarea className="input-field h-24" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea>
                </div>
                <button type="submit" className="w-full btn-primary py-3">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
