import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Callback from './Callback';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/callback" element={<Callback />} />
        </Routes>
    </BrowserRouter>
);
