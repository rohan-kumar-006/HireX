import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await API.get('/auth/me');
            setUser(data);
        };
        fetchUser();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        try {
            const { data } = await API.post('/applications/resume', formData);
            setAnalysis(data.analysis);
            alert('Resume processed!');
        } catch (error) {
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">My Profile</h2>
                <Link to="/edit-profile" className="btn-primary">Edit Profile</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 bg-white p-6 rounded-lg border border-gray-200 h-fit">
                    <p className="font-bold text-xl mb-1">{user.name}</p>
                    <p className="text-gray-600 mb-4">{user.email}</p>
                    <div className="mb-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-bold uppercase">
                            {user.role}
                        </span>
                    </div>
                    <hr className="my-4" />
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">College</p>
                            <p className="text-sm font-medium">{user.profile?.college || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Experience</p>
                            <p className="text-sm font-medium">{user.profile?.experience || 'None'}</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="font-bold mb-2">About Me</h3>
                        <p className="text-gray-700 whitespace-pre-line">{user.profile?.bio || 'Add a bio to your profile'}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="font-bold mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.profile?.skills?.map(skill => (
                                <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                            {(!user.profile?.skills || user.profile.skills.length === 0) && (
                                <p className="text-gray-400 text-sm italic">No skills added yet</p>
                            )}
                        </div>
                    </div>

                    {/* {user.role === 'student' && (
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="font-bold mb-4">Update Resume (AI Analysis)</h3>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                <button type="submit" disabled={loading} className="btn-primary">
                                    {loading ? 'Analyzing...' : 'Upload & Analyze Resume'}
                                </button>
                            </form>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default Profile;
