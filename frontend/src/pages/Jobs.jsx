import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';

const Jobs = () => {
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [filters, setFilters] = useState({
        workType: '',
        minSalary: '',
        maxSalary: ''
    });
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            const searchQuery = searchParams.get('search') || '';
            const { data } = await API.get('/jobs', {
                params: {
                    search: searchQuery,
                    workType: filters.workType,
                    minSalary: filters.minSalary,
                    maxSalary: filters.maxSalary
                }
            });
            setJobs(data);
            if (data.length > 0) setSelectedJob(data[0]);
            else setSelectedJob(null);
        };
        fetchJobs();
    }, [searchParams, filters]);

    const handleApply = async (id) => {
        if (applying) return;
        setApplying(true);
        try {
            const { data } = await API.post(`/applications/apply/${id}`);
            toast.success(data.message || 'Applied successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Apply failed');
        } finally {
            setApplying(false);
        }
    };


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 p-4 bg-white border border-gray-200 rounded-lg flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Work Type</label>
                    <select
                        className="border border-gray-300 rounded p-2 text-sm"
                        value={filters.workType}
                        onChange={(e) => setFilters({ ...filters, workType: e.target.value })}
                    >
                        <option value="">All Types</option>
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Min Salary</label>
                    <input
                        type="number"
                        placeholder="Min"
                        className="border border-gray-300 rounded p-2 text-sm w-32"
                        value={filters.minSalary}
                        onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Max Salary</label>
                    <input
                        type="number"
                        placeholder="Max"
                        className="border border-gray-300 rounded p-2 text-sm w-32"
                        value={filters.maxSalary}
                        onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                    />
                </div>
                <button
                    onClick={() => setFilters({ workType: '', minSalary: '', maxSalary: '' })}
                    className="text-gray-500 text-sm hover:underline py-2"
                >
                    Clear Filters
                </button>
            </div>

            <div className="flex space-x-8">
                {/* Left side: Job Cards */}
                <div className="w-1/3 space-y-4">
                    <h2 className="text-xl font-bold mb-4">
                        {searchParams.get('search') ? `Results for "${searchParams.get('search')}"` : 'Jobs for you'}
                    </h2>
                    {jobs.map(job => (
                        <div
                            key={job._id}
                            className={`p-4 bg-white border rounded-lg cursor-pointer transition ${selectedJob?._id === job._id ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'}`}
                            onClick={() => setSelectedJob(job)}
                        >
                            <h3 className="font-bold text-lg">{job.title}</h3>
                            <p className="text-gray-600 text-sm">{job.recruiter.name}</p>
                            <p className="text-gray-500 text-sm mt-2">{job.location} · {job.workType}</p>
                            <div className="flex justify-between items-center mt-4">
                                {job.isActive !== false ? (
                                    user?.role === 'student' && <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Easy Apply</span>
                                ) : (
                                    <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded">Closed</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {jobs.length === 0 && <p className="text-gray-500">No jobs found matching your criteria.</p>}
                </div>

                <div className="w-2/3 bg-white border border-gray-200 rounded-lg p-8 sticky top-8 h-fit">
                    {selectedJob ? (
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-3xl font-bold">{selectedJob.title}</h2>
                                {selectedJob.isActive === false && (
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Closed</span>
                                )}
                            </div>
                             <p className="text-gray-600 mb-6">
                                <Link to={`/profile/${selectedJob.recruiter._id}`} className="hover:text-green-600 underline transition font-lg">
                                    {selectedJob.recruiter.name}
                                </Link>
                                 · {selectedJob.location} · {selectedJob.workType}
                            </p>

                            {selectedJob.isActive !== false ? (
                                user?.role === 'student' ? (
                                    <button
                                        onClick={() => handleApply(selectedJob._id)}
                                        disabled={applying}
                                        className={`bg-green-600 text-white px-8 py-3 rounded-md font-bold hover:bg-green-700 transition mb-8 flex items-center ${applying ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {applying ? 'Applying...' : 'Quick Apply'}
                                    </button>
                                ) : user?.role === 'recruiter' ? (
                                    <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-8 border border-yellow-100 text-sm">
                                        Recruiters cannot apply for jobs.
                                    </div>
                                ) : (
                                    <Link to="/login" className="inline-block bg-green-600 text-white px-8 py-3 rounded-md font-bold hover:bg-green-700 mb-8">
                                        Login to Apply
                                    </Link>
                                )
                            ) : (
                                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-100 text-sm font-bold">
                                    This job is no longer accepting applications.
                                </div>
                            )}
                            <hr className="mb-8" />
                            <h3 className="font-bold text-lg mb-4">Job details</h3>
                            <div className="space-y-4 text-gray-700">
                                <div>
                                    <p className="font-bold text-sm">Salary</p>
                                    <p>
                                        {selectedJob.salaryMin && selectedJob.salaryMax 
                                            ? `₹${selectedJob.salaryMin.toLocaleString()} - ₹${selectedJob.salaryMax.toLocaleString()}`
                                            : selectedJob.salary || 'Not specified'}
                                    </p>
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
        </div>
    );
}

export default Jobs;