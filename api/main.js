import express from 'express';

const app = express();
const PORT = 3000;

// Middleware to parse JSON or URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
