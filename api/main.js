import express from 'express';
import cors from 'cors'
import {conn} from "./database/neo4j.database.js";

import {createUserRepository} from "./repositories/user_repository.js";
import {createUserService} from "./services/user_service.js";
import {createUserController} from "./controllers/user_controller.js";
import {createTrackRepository} from "./repositories/track_repository.js";
import {createTrackService} from "./services/track_service.js";

const app = express();
const PORT = 3000;

// Middleware to parse JSON or URL-encoded bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const trackRepository = createTrackRepository(conn);
const trackService = createTrackService(trackRepository);

const userRepository = createUserRepository(conn);
const userService = createUserService(userRepository);
const userController = createUserController(userService, trackService);

app.get('/api/graph', async (req, res) => await userController.graphUserData(req, res))
app.post('/api/user', async (req, res) => await userController.createUser(req, res))

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
