import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            const { data } = await API.get('/jobs');
            setJobs(data);
            if (data.length > 0) setSelectedJob(data[0]);
        };
        fetchJobs();
    }, []);

    const handleApply = async (id) => {
        try {
            await API.post(`/applications/apply/${id}`);
            alert('Applied successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Apply failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex space-x-8">
            {/* Left side: Job Cards */}
            <div className="w-1/3 space-y-4">
                <h2 className="text-xl font-bold mb-4">Jobs for you</h2>
                {jobs.map(job => (
                    <div 
                        key={job._id} 
                        className={`p-4 bg-white border rounded-lg cursor-pointer transition ${selectedJob?._id === job._id ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'}`}
                        onClick={() => setSelectedJob(job)}
                    >
                        <h3 className="font-bold text-lg">{job.title}</h3>
                        <p className="text-gray-600 text-sm">{job.recruiter.name}</p>
                        <p className="text-gray-500 text-sm mt-2">{job.location}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Easy Apply</span>
                            <span className="text-gray-400 text-xs">Recently posted</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right side: Job Details */}
            <div className="w-2/3 bg-white border border-gray-200 rounded-lg p-8 sticky top-8 h-fit">
                {selectedJob ? (
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{selectedJob.title}</h2>
                        <p className="text-gray-600 mb-6">{selectedJob.recruiter.name} · {selectedJob.location}</p>
                        <button 
                            onClick={() => handleApply(selectedJob._id)}
                            className="bg-green-600 text-white px-8 py-3 rounded-md font-bold hover:bg-green-700 transition mb-8 flex items-center"
                        >
                            Quick Apply
                        </button>
                        <hr className="mb-8" />
                        <h3 className="font-bold text-lg mb-4">Job details</h3>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <p className="font-bold text-sm">Salary</p>
                                <p>{selectedJob.salary || 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-sm mb-2">Description</p>
                                <p className="whitespace-pre-line">{selectedJob.description}</p>
                            </div>
                            <div>
                                <p className="font-bold text-sm mb-2">Requirements</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedJob.requirements.map(req => (
                                        <span key={req} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{req}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Select a job to view details</p>
                )}
            </div>
        </div>
    );
};

export default Jobs;
