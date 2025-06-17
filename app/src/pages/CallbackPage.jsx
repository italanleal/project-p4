import React, { useEffect, useState } from 'react';

const clientId = 'd1c4219dadaf49bebc3a5d962b1dcb20';
const redirectUrl = 'http://127.0.0.1:8888/callback';
const authorizationEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const scope = 'user-read-private user-read-email user-top-read';

function CallbackPage() {
    const [userData, setUserData] = useState(null);
    const [tokenInfo, setTokenInfo] = useState({});

    const currentToken = {
        get access_token() { return localStorage.getItem('access_token') || null; },
        get refresh_token() { return localStorage.getItem('refresh_token') || null; },
        get expires_in() { return localStorage.getItem('expires_in') || null; },
        get expires() { return localStorage.getItem('expires') || null; },

        save: (response) => {
            const { access_token, refresh_token, expires_in } = response;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('expires_in', expires_in);

            const now = new Date();
            const expiry = new Date(now.getTime() + expires_in * 1000);
            localStorage.setItem('expires', expiry.toString());
        },
    };

    useEffect(() => {
        const args = new URLSearchParams(window.location.search);
        const code = args.get('code');

        if (code) {
            getToken(code).then((token) => {
                currentToken.save(token);
                window.history.replaceState({}, document.title, window.location.pathname);
                fetchUserData();
            });
        } else if (currentToken.access_token) {
            fetchUserData();
        }
    }, []);

    const redirectToSpotifyAuthorize = async () => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const randomValues = crypto.getRandomValues(new Uint8Array(64));
        const code_verifier = randomValues.reduce((acc, x) => acc + possible[x % possible.length], '');

        const data = new TextEncoder().encode(code_verifier);
        const hashed = await crypto.subtle.digest('SHA-256', data);

        const code_challenge = btoa(String.fromCharCode(...new Uint8Array(hashed)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        localStorage.setItem('code_verifier', code_verifier);

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            code_challenge_method: 'S256',
            code_challenge: code_challenge,
            redirect_uri: redirectUrl,
        });

        window.location.href = `${authorizationEndpoint}?${params.toString()}`;
    };

    const getToken = async (code) => {
        const code_verifier = localStorage.getItem('code_verifier');

        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUrl,
                code_verifier,
            }),
        });

        return await response.json();
    };

    const refreshToken = async () => {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'refresh_token',
                refresh_token: currentToken.refresh_token,
            }),
        });

        const token = await response.json();
        currentToken.save(token);
        setTokenInfo(token);
    };

    const fetchUserData = async () => {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${currentToken.access_token}` },
        });
        const data = await response.json();
        setUserData(data);
        setTokenInfo({
            access_token: currentToken.access_token,
            refresh_token: currentToken.refresh_token,
            expires: currentToken.expires,
        });
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = redirectUrl;
    };

    const sendRequest = async () => {

        const response = await fetch('http://127.0.0.1:3000/api/graph', {
            method: 'GET',
            headers: { Authorization: `Bearer ${currentToken.access_token}` }
        })
        const data = await response.json();
        // const response = await fetch('http://127.0.0.1:3000/api/user', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         userId: userData.id,
        //         displayName: userData?.display_name,
        //         profileImageUrl: userData.images[0].url
        //     }),
        // });
        // const data = await response.json();


        console.log(data);
    }

    if (!currentToken.access_token) {
        return (
            <div>
                <h1>Welcome to the OAuth2 PKCE Example</h1>
                <button onClick={redirectToSpotifyAuthorize}>Log in with Spotify</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Logged in as {userData?.display_name}</h1>
            {userData?.images?.[0]?.url && <img width="150" src={userData.images[0].url} alt={userData.display_name} />}
            <table>
                <tbody>
                <tr><td>Display name</td><td>{userData?.display_name}</td></tr>
                <tr><td>Id</td><td>{userData?.id}</td></tr>
                <tr><td>Email</td><td>{userData?.email}</td></tr>
                <tr><td>Spotify URI</td><td><a href={userData?.external_urls?.spotify}>{userData?.external_urls?.spotify}</a></td></tr>
                <tr><td>Link</td><td><a href={userData?.href}>{userData?.href}</a></td></tr>
                <tr><td>Profile Image</td><td><a href={userData?.images?.[0]?.url}>{userData?.images?.[0]?.url}</a></td></tr>
                <tr><td>Country</td><td>{userData?.country}</td></tr>
                </tbody>
            </table>

            <button onClick={refreshToken}>Refresh Token</button>
            <button onClick={logout}>Log out</button>

            <h2>OAuth Info</h2>
            <table>
                <tbody>
                <tr><td>Access token</td><td>{tokenInfo.access_token}</td></tr>
                <tr><td>Refresh token</td><td>{tokenInfo.refresh_token}</td></tr>
                <tr><td>Expiration at</td><td>{tokenInfo.expires}</td></tr>
                </tbody>
            </table>

            <h2>BackEnd Integration</h2>
            <button onClick={sendRequest}>Send Request</button>
        </div>
    );
}

export default CallbackPage;
