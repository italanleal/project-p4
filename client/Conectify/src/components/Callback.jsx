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

    return <p>Processing login...</p>;
}
