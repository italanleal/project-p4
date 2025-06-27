import express from 'express';
import cors from 'cors'
import {conn} from "./database/neo4j.database.js";

import {createUserRepository} from "./repositories/user_repository.js";
import {createUserService} from "./services/user_service.js";
import {createUserController} from "./controllers/user_controller.js";
import {createArtistController} from './controllers/artist_controller.js';
import {createTrackRepository} from "./repositories/track_repository.js";
import {createTrackService} from "./services/track_service.js";
import {createArtistService} from "./services/artist_service.js";
import {createArtistRepository} from "./repositories/artist_repository.js";

const app = express();
const PORT = 3051;

// Middleware to parse JSON or URL-encoded bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const artistRepository = createArtistRepository(conn);
const artistService = createArtistService(artistRepository);
const artistController = createArtistController(artistService);

const trackRepository = createTrackRepository(conn);
const trackService = createTrackService(trackRepository);

const userRepository = createUserRepository(conn);
const userService = createUserService(userRepository);
const userController = createUserController(userService, trackService, artistService);

app.post('/api/user', async (req, res) => await userController.createUser(req, res))
app.get('/api/user/:userId', async (req, res) => await userController.returnUser(req, res))
app.put('/api/user/:userId', async (req, res) => await userController.updateUser(req, res))
app.delete('/api/user/:userId', async (req, res) => await userController.deleteUser(req, res))

app.get('/api/user/data', async (req, res) => await userController.userData(req, res))
app.get('/api/artist/index', async (req, res) => await artistController.returnArtistsIndex(req, res))
app.post('/api/network', async (req, res) => await artistController.renderNetwork(req, res))


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
