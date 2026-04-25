import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

const Applicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            const { data } = await API.get(`/applications/job/${jobId}`);
            setApplicants(data);
        };
        fetchApplicants();
    }, [jobId]);

    const handleStatus = async (id, status) => {
        try {
            await API.put(`/applications/${id}/status`, { status });
            setApplicants(applicants.map(app =>
                app._id === id ? { ...app, status } : app
            ));
        } catch (error) {
            alert('Error updating status');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6">Applicants (Ranked by AI match)</h2>
            <div className="space-y-4">
                {applicants.map(app => (
                    <div key={app._id} className="bg-white p-6 rounded-lg border border-gray-200 flex justify-between items-start">
                        <div className="w-2/3">
                            <div className="flex items-center gap-3 mb-1">
                                <Link to={`/profile/${app.student._id}`} className="hover:text-green-600 transition">
                                    <h3 className="font-bold text-lg">{app.student.name}</h3>
                                </Link>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                    {app.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{app.student.email}</p>

                            <div className="mb-4">
                                

                                {app?.missingSkills.length > 0 ? (
                                    
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <p className="font-bold text-sm text-red-600">Missing Skills Gaps:</p>
                                        {app.missingSkills.map(skill => (
                                            <span key={skill} className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-sm text-green-600 font-semibold mt-1">
                                        No missing skills 
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-500 italic">"{app.student.profile.bio?.substring(0, 100)}..."</p>
                        </div>

                        <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">{app.matchScore}%</div>
                            <div className="text-xs text-gray-400 uppercase font-bold">Match Score</div>

                            {app.student.profile?.resume ? (
                                <a
                                    href={app.student.profile.resume.startsWith('http') ? app.student.profile.resume : `${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}${app.student.profile.resume}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded text-sm font-bold hover:bg-blue-100 transition"
                                >
                                    View Resume
                                </a>
                            ) : (
                                <p className="mt-6 text-xs text-red-500 font-bold uppercase">No resume</p>
                            )}

                            <Link
                                to={`/chat/${jobId}/${app.student._id}`}
                                state={{
                                    jobTitle: "Job Application",
                                    otherUserName: app.student.name,
                                    otherUserId: app.student._id
                                }}
                                className="mt-2 block bg-green-50 text-green-600 px-4 py-2 rounded text-sm font-bold hover:bg-green-100 transition text-center"
                            >
                                Chat
                            </Link>

                            {app.status === 'applied' && (
                                <div className="mt-4 flex gap-2 justify-end">
                                    <button
                                        onClick={() => handleStatus(app._id, 'accepted')}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleStatus(app._id, 'rejected')}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {applicants.length === 0 && <p className="text-gray-500">No applicants yet.</p>}
            </div>
        </div>
    );
};

export default Applicants;
