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
import MyJobs from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import ResumeAnalyzer from './pages/ResumeAnalyzer';

import ChatPage from './pages/ChatPage';
import SelectRole from './pages/SelectRole';
import ProtectedRoute from './components/ProtectedRoute'; // New
import { ToastContainer } from 'react-toastify';


import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "31549017237-aif4k19i6r4n51e8hjekt05f0n8jr8d4.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
          <Route path="/applicants/:jobId" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
          <Route path="/my-jobs" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/chat/:jobId/:applicantId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

          <Route path="/select-role" element={<SelectRole />} />

        </Routes>
      </div>
    </Router>
    </GoogleOAuthProvider>
  );
}



export default App;
