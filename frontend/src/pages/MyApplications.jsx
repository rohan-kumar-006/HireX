import React, { useState, useEffect } from 'react';
import API from '../api';

const MyApplications = () => {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        const fetchApps = async () => {
            const { data } = await API.get('/applications/my-apps');
            setApps(data);
        };
        fetchApps();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6">My Job Applications</h2>
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-sm">Job Title</th>
                            <th className="p-4 font-bold text-sm">Company</th>
                            <th className="p-4 font-bold text-sm">Match Score</th>
                            <th className="p-4 font-bold text-sm">Applied Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apps.map(app => (
                            <tr key={app._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4">{app.job.title}</td>
                                <td className="p-4 font-medium">{app.job.recruiter?.name || 'Company'}</td>
                                <td className="p-4">
                                    <span className={`font-bold ${app.matchScore > 70 ? 'text-green-600' : 'text-gray-600'}`}>
                                        {app.matchScore}%
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {apps.length === 0 && <p className="p-8 text-center text-gray-500">You haven't applied to any jobs yet.</p>}
            </div>
        </div>
    );
};

export default MyApplications;
