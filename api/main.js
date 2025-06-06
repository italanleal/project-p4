import express from 'express';

const app = express();
const PORT = 8888;

// Middleware to parse JSON or URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the /callback endpoint
app.get('/callback/', async (req, res) => {
    let code = req.query.code;
    console.log(code)
    const getToken = async function () {
      // stored in the previous step
      const codeVerifier = localStorage.getItem('code_verifier');

      const url = "https://accounts.spotify.com/api/token";
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      }

      const body = await fetch(url, payload);
      const response = await body.json();

      localStorage.setItem('access_token', response.access_token);
      res.json(response);
    }

    await getToken();

});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
