import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const MyJobs = () => {
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

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Posted Jobs</h2>
                <Link to="/post-job" className="btn-primary">Post New Job</Link>
            </div>
            
            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-sm">Job Title</th>
                            <th className="p-4 font-bold text-sm">Location</th>
                            <th className="p-4 font-bold text-sm">Type</th>
                            <th className="p-4 font-bold text-sm">Date Posted</th>
                            <th className="p-4 font-bold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 font-medium">{job.title}</td>
                                <td className="p-4 text-gray-600">{job.location}</td>
                                <td className="p-4">
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{job.workType}</span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <Link 
                                        to={`/applicants/${job._id}`}
                                        className="text-blue-600 hover:underline font-bold text-sm"
                                    >
                                        View Applicants
                                    </Link>
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

export default MyJobs;
