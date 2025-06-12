import express from 'express';
import cors from 'cors'
import {createUser} from "./models/user.js";
import {conn} from "./database/neo4j.database.js";

import {createUserRepository} from "./repositories/user_repository.js";
import {createUserService} from "./services/user_service.js";
import {createUserController} from "./controllers/user_controller.js";

const app = express();
const PORT = 3000;

// Middleware to parse JSON or URL-encoded bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRepository = createUserRepository(conn);
const userService = createUserService(userRepository);
const userController = createUserController(userService);

app.post('/api/user', async (req, res) => await userController.createUser(req, res))

/*
app.get('/api/register', async (req, res) => {
  const access_token = req.headers.authorization.split(' ')[1]

  if (!access_token) {
    return res.status(401).json({ message: 'Token de acesso não fornecido.' });
  }
    const url = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10';

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();

        return res.status(200).json({
            message: 'Registered',
            data: data
        });

    } catch (error) {
        console.error('Erro na requisição fetch:', error);
        return res.status(500).json({ error: 'Erro ao buscar faixas do Spotify.' });
    }
  })

 */
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
