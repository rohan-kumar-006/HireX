import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

const Profile = () => {
    const { userId } = useParams();
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const isOwnProfile = !userId || userId === (loggedInUser?.id || loggedInUser?._id);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const endpoint = userId ? `/auth/user/${userId}` : '/auth/me';
                const { data } = await API.get(endpoint);
                setUser(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, [userId]);


    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.warn('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        try {
            console.log('--- STARTING UPLOAD ---');
            const { data } = await API.post('/auth/upload-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            console.log('UPLOAD RESPONSE:', data);

            if (data.user) {
                setUser(data.user);
                toast.success('Resume uploaded successfully!');
                setFile(null); // Optional: clear file input
            } else {
                throw new Error('No user data returned from server');
            }
        } catch (error) {
            console.error('UPLOAD ERROR:', error);
            const errorMsg = error.response?.data?.message || 'Upload failed';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
            console.log('--- UPLOAD FINISHED ---');
        }
    };

    if (!user) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">{isOwnProfile ? 'My Profile' : 'Profile'}</h2>
                {isOwnProfile && <Link to="/edit-profile" className="btn-primary">Edit Profile</Link>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 bg-white p-6 rounded-lg border border-gray-200 h-fit">
                    <p className="font-bold text-xl mb-1">{user.name}</p>
                    <p className="text-gray-600 mb-4">{user.email}</p>
                    <div className="mb-4">
                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${user.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {user.role}
                        </span>
                    </div>
                    <hr className="my-4" />
                    <div className="space-y-4">
                        {user.role === 'student' ? (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">College</p>
                                <p className="text-sm font-medium">{user.profile?.college || 'Not set'}</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Company</p>
                                <p className="text-sm font-medium">{user.profile?.companyName || 'Not set'}</p>
                            </div>
                        )}

                        {user.profile?.linkedin && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">LinkedIn</p>
                                <a href={user.profile.linkedin} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">View Profile</a>
                            </div>
                        )}

                        {user.role === 'student' && user.profile?.portfolio && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Portfolio</p>
                                <a href={user.profile.portfolio} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">View Portfolio</a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="font-bold mb-2">{user.role === 'student' ? 'About Me' : 'Company Description'}</h3>
                        <p className="text-gray-700 whitespace-pre-line">
                            {user.role === 'student' ? (user.profile?.bio || 'No bio added') : (user.profile?.companyDescription || 'No description added')}
                        </p>
                    </div>

                    {user.role === 'student' ? (
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
                    ) : (
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="font-bold mb-2">Ongoing Projects</h3>
                            <p className="text-gray-700">{user.profile?.ongoingProjects || 'No active projects listed'}</p>
                        </div>
                    )}

                    {user.role === 'student' && (
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-bold mb-4">Resume</h3>

                            {user.profile?.resume ? (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-red-100 text-red-600 p-2 rounded">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-700">{user.profile.resumeName || 'My Resume.pdf'}</p>
                                                <a
                                                    href={user.profile.resume.startsWith('http') ? user.profile.resume : `${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}${user.profile.resume}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 text-xs hover:underline"
                                                >
                                                    View Resume
                                                </a>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Uploaded</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center mb-6">
                                    <p className="text-gray-500 text-sm">No resume uploaded yet.</p>
                                </div>
                            )}

                            {isOwnProfile && (
                                <form onSubmit={handleUpload} className="space-y-4 pt-4 border-t border-gray-50">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Upload or Replace Resume (PDF)</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition disabled:bg-blue-300">
                                        {loading ? 'Uploading...' : 'Upload Resume'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;
