import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CallbackPage from './pages/CallbackPage';
import HomePage from './pages/HomePage';
import UserProfile from "@/pages/UserProfile.jsx";

function App({ user, onLogout, onRefresh }) {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/callback" element={<CallbackPage />} />
                <Route path="/profile" element={<UserProfile user={}/>} />
            </Routes>
        </Router>
    );
}

export default App;
