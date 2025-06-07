import { redirectToSpotifyAuthorize } from './utils/auth';

export default function Login() {
    return (
        <div>
            <h1>Welcome to the OAuth2</h1>
            <button onClick={redirectToSpotifyAuthorize}>Log in with Spotify</button>
        </div>
    );
}
