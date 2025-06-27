import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CallbackPage from './pages/CallbackPage';
import HomePage from './pages/HomePage';
import './App.css'

function App() {
    return (
       <CallbackPage />
    );
}

export default App;
