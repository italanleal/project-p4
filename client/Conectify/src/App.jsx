import { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import { currentToken, getToken, getUserData, refreshToken } from './auth/auth';

function isTokenExpired() {
    const expires = currentToken.expires;
    if (!expires) return true;

    const now = new Date();
    const expiryDate = new Date(expires);
    return now >= expiryDate;
}

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        const exchangeCodeIfNeeded = async () => {
            if (code) {
                const token = await getToken(code);
                console.log("Token exchange response:", token);

                if (token.access_token) {
                    currentToken.save(token);

                    // Remove the code from the URL
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete('code');
                    window.history.replaceState({}, document.title, newUrl.toString());
                } else {
                    console.error("Failed to exchange code for token:", token);
                    return;
                }
            }

            if (!currentToken.access_token) return;

            if (isTokenExpired()) {
                console.log("Access token expired, refreshing...");
                const token = await refreshToken();
                console.log("Refresh response:", token);

                if (token.access_token) {
                    currentToken.save(token);
                } else {
                    console.error("Failed to refresh token:", token);
                    return;
                }
            }

            const userData = await getUserData();
            console.log("User data result:", userData);
            if (userData) {
                setUser(userData);
            }
        };

        exchangeCodeIfNeeded();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        window.location.href = '/';
    };

    const handleRefresh = async () => {
        const token = await refreshToken();
        if (token.access_token) {
            currentToken.save(token);
            const userData = await getUserData();
            setUser(userData);
        } else {
            console.error("Failed to refresh token on manual refresh:", token);
        }
    };

    console.log("Current access token:", currentToken.access_token);
    console.log("Current user:", user);

    if (!currentToken.access_token) {
        return <Login />;
    }

    if (!user) {
        return <p>Loading user...</p>;
    }

    return <Dashboard user={user} onLogout={handleLogout} onRefresh={handleRefresh} />;
}

export default App;
