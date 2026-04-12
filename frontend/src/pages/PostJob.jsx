import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const PostJob = () => {
    const [jobData, setJobData] = useState({
        title: '', description: '', requirements: '', location: '', salary: '',
        workType: 'On-site', salaryMin: '', salaryMax: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/jobs', jobData);
            alert('Job posted!');
            navigate('/jobs');
        } catch (error) {
            alert('Failed to post job');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
                <div>
                    <label className="block text-sm font-medium mb-1">Job Title</label>
                    <input className="input-field" onChange={(e) => setJobData({...jobData, title: e.target.value})} required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea className="input-field h-32" onChange={(e) => setJobData({...jobData, description: e.target.value})} required></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Requirements (comma separated)</label>
                    <input className="input-field" placeholder="React, Node.js, MongoDB" onChange={(e) => setJobData({...jobData, requirements: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input className="input-field" onChange={(e) => setJobData({...jobData, location: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Work Type</label>
                        <select className="input-field" value={jobData.workType} onChange={(e) => setJobData({...jobData, workType: e.target.value})}>
                            <option value="On-site">On-site</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Min Salary</label>
                        <input type="number" className="input-field" placeholder="e.g. 50000" onChange={(e) => setJobData({...jobData, salaryMin: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Max Salary</label>
                        <input type="number" className="input-field" placeholder="e.g. 80000" onChange={(e) => setJobData({...jobData, salaryMax: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Salary Display Text</label>
                    <input className="input-field" placeholder="e.g. $50k - $80k per year" onChange={(e) => setJobData({...jobData, salary: e.target.value})} />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Post Job</button>
            </form>
        </div>
    );
};

export default PostJob;
