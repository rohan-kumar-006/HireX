import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await API.get('/jobs/my');
                setJobs(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchJobs();
    }, []);

    const handleCloseJob = async (id) => {
        if (!window.confirm('Stop accepting applications for this job?')) return;
        try {
            await API.put(`/jobs/${id}/close`);
            setJobs(jobs.map(job => job._id === id ? { ...job, isActive: false } : job));
        } catch (error) {
            console.log("Close job error:", error.response?.data);
            alert(error.response?.data?.message || 'Error closing job');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Posted Jobs</h2>
                <Link to="/post-job" className="btn-primary">Post New Job</Link>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-sm">Job Title</th>
                            <th className="p-4 font-bold text-sm">Status</th>
                            <th className="p-4 font-bold text-sm">Location</th>
                            <th className="p-4 font-bold text-sm">Type</th>
                            <th className="p-4 font-bold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <p className="">{job.title}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-black">{new Date(job.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${job.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {job.isActive !== false ? 'Active' : 'Closed'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600 text-sm">{job.location}</td>
                                <td className="p-4 text-sm">{job.workType}</td>
                                <td className="p-4 text-right space-x-4">
                                    <Link 
                                        to={`/applicants/${job._id}`}
                                        className="text-blue-600 hover:text-blue-800 p-1 border shadow-sm rounded-xl font-semibold text-sm"
                                    >
                                        Applicants
                                    </Link>
                                    
                                    {job.isActive !== false ? (
                                        <button 
                                            onClick={() => handleCloseJob(job._id)}
                                            className="text-red-600 hover:text-red-800 p-1 border shadow-sm rounded-xl font-semibold text-sm"
                                        >
                                            Stop Accepting
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 font-bold text-sm italic">Closed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {jobs.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <p>You haven't posted any jobs yet.</p>
                        <Link to="/post-job" className="text-blue-600 hover:underline mt-2 inline-block">Post your first job</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
