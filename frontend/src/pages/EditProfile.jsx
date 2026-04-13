import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '', bio: '', college: '', skills: '', linkedin: '', portfolio: '',
        companyName: '', companyDescription: '', ongoingProjects: ''
    });
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await API.get('/auth/me');
                setRole(data.role);
                setFormData({
                    name: data.name || '',
                    bio: data.profile?.bio || '',
                    college: data.profile?.college || '',
                    skills: data.profile?.skills?.join(', ') || '',
                    linkedin: data.profile?.linkedin || '',
                    portfolio: data.profile?.portfolio || '',
                    companyName: data.profile?.companyName || '',
                    companyDescription: data.profile?.companyDescription || '',
                    ongoingProjects: data.profile?.ongoingProjects || ''
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
            <h2 className="text-2xl font-bold mb-6 text-green-700">Edit Profile ({role})</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>

                {role === 'student' ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1">College</label>
                            <input className="input-field" value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                            <input className="input-field" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Portfolio Link</label>
                            <input className="input-field" value={formData.portfolio} onChange={(e) => setFormData({...formData, portfolio: e.target.value})} placeholder="https://portfolio.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Bio / Description</label>
                            <textarea className="input-field h-24" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-1">Company Name</label>
                            <input className="input-field" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ongoing Projects</label>
                            <input className="input-field" value={formData.ongoingProjects} onChange={(e) => setFormData({...formData, ongoingProjects: e.target.value})} placeholder="Active hiring for... / Internal portal" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Company Description</label>
                            <textarea className="input-field h-24" value={formData.companyDescription} onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}></textarea>
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
                    <input className="input-field" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} placeholder="https://linkedin.com/in/username" />
                </div>

                <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
