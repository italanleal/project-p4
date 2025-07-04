import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from "@/context/UserProvider";
import FancyBackground from "@/components/FancyGround.jsx";
import {LoadingSpinner} from "@/components/LoadingSpinner.jsx";
const vps = "https://b26cc315-7b34-4312-ae43-ac6761795181.vercel.app"

const clientId = 'd1c4219dadaf49bebc3a5d962b1dcb20';

const redirectUrl = 'https://project-p4.vercel.app/callback';

const authorizationEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const scope = 'user-read-private user-read-email user-top-read';

export const redirectToSpotifyAuthorize = async () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const code_verifier = randomValues.reduce((acc, x) => acc + possible[x % possible.length], '');

    const data = new TextEncoder().encode(code_verifier);
    const hashed = await window.crypto.subtle.digest('SHA-256', data);

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

function CallbackPage() {
    const navigate = useNavigate();
    const { login } = useUser();

    const currentToken = {
        get access_token() {
            return localStorage.getItem('access_token') || null;
        },
        get refresh_token() {
            return localStorage.getItem('refresh_token') || null;
        },
        get expires_in() {
            return localStorage.getItem('expires_in') || null;
        },
        get expires() {
            return localStorage.getItem('expires') || null;
        },
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
    function isTokenExpired() {
        const expiry = new Date(localStorage.getItem('expires'));
        return new Date() >= expiry;
    }

    useEffect(() => {
        const args = new URLSearchParams(window.location.search);
        const code = args.get('code');

        const  handleAuth = async () => {
            if (code) {
                const token = await getToken(code);

                if (token.error) {
                    console.error("Erro ao obter token:", token);
                    return;
                }

                console.log(token)
                currentToken.save(token);
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            if (currentToken.access_token) {
                if (isTokenExpired()) {
                    console.log("Token expirado. Redirecionando para autorização.");
                    return redirectToSpotifyAuthorize();
                }

                const userData = await fetchUserData();

                const res = await fetch(vps+"/api/user/", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${currentToken.access_token}`,
                    },
                });

                if (res.ok) {
                    const existingUser = await res.json();
                    console.log(existingUser);
                    login(existingUser);
                    navigate('/dashboard', { replace: true });
                } else {
                    login(userData);
                    navigate('/edit', { replace: true });
                }

            } else {
                redirectToSpotifyAuthorize()
            }
        };

        handleAuth();
    }, []);

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

    const fetchUserData = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${currentToken.access_token}` },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar dados do usuário no Spotify");
            }

            return await response.json();
        } catch (err) {
            console.error(err);
            redirectToSpotifyAuthorize();
        }
    };

    return (
        <FancyBackground>
            <LoadingSpinner text="Conectando com o Spotify..." size="md" />
        </FancyBackground>
    );
}

export default CallbackPage;
