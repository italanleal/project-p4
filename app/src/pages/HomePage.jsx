import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('HomePage');
        navigate('/callback', { replace: true });
    }, [navigate]);

    return null; // or a loader
}
