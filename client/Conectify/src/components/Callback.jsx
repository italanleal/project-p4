import { useEffect } from 'react';
import { getToken, currentToken } from '../auth/auth.js';
import { useNavigate } from 'react-router-dom';

export default function Callback() {
    const navigate = useNavigate();

    useEffect(() => {
        const args = new URLSearchParams(window.location.search);
        const code = args.get('code');
        if (code) {
            getToken(code).then(token => {
                currentToken.save(token);
                navigate('/');
            });
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500 border-solid mx-auto mb-6"></div>
                <p className="text-lg font-medium text-gray-700">Processing login...</p>
            </div>
        </div>
    );
}
