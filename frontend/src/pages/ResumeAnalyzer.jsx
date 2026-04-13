import React, { useState } from 'react';
import API from '../api';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        try {
            const { data } = await API.post('/ai/resume-analyze', formData);
            setAnalysis(data);
        } catch (err) {
            alert('Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-10 mt-10 bg-white border rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold mb-4 text-green-700">AI Resume Analyzer</h2>
            <p className="text-gray-600 mb-8">Upload your resume to get instant AI suggestions and see extracted skills.</p>

            <form onSubmit={handleUpload} className="mb-10 p-6 border-2 border-dashed border-gray-200 rounded-lg text-center">
                <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setFile(e.target.files[0])}
                    className="mb-4 block w-full text-center" 
                />
                <button 
                    disabled={loading}
                    className="btn-primary px-10 py-3 font-bold"
                >
                    {loading ? 'Analyzing with AI...' : 'Analyze Resume'}
                </button>
            </form>

            {analysis && (
                <div className="space-y-6">
                    <div className="p-4 bg-green-50 rounded border border-green-100">
                        <h3 className="font-bold text-green-800 text-lg mb-2">Summary</h3>
                        <p className="text-gray-700">{analysis.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {analysis.skills && (
                            <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-2">Extracted Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.skills.map(s => (
                                        <span key={s} className="bg-white px-2 py-1 rounded border text-xs">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {analysis.positives && (
                            <div className="p-4 bg-green-50 rounded border border-green-100">
                                <h3 className="font-bold text-green-800 mb-2">Resume Strengths</h3>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                    {analysis.positives.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        )}

                        {analysis.negatives && (
                            <div className="p-4 bg-red-50 rounded border border-red-100">
                                <h3 className="font-bold text-red-800 mb-2">Missing/Weak Areas</h3>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                    {analysis.negatives.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        )}

                        {analysis.suggestions && (
                            <div className="p-4 bg-yellow-50 rounded border border-yellow-100">
                                <h3 className="font-bold text-yellow-800 mb-2">AI Suggestions</h3>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                    {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default ResumeAnalyzer;
