import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob';
import Applicants from './pages/Applicants';
import MyApplications from './pages/MyApplications';
import EditProfile from './pages/EditProfile';
import ResumeAnalyzer from './pages/ResumeAnalyzer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/applicants/:jobId" element={<Applicants />} />
          <Route path="/my-applications" element={<MyApplications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
