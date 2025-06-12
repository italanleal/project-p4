import {createUser} from "../models/user.js";

export class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(req, res) {
        /*
        const access_token = req.headers.authorization.split(' ')[1]

        if (!access_token) return res.status(401).json({ message: 'Token de acesso não fornecido.' })

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        */

        const newUser = createUser()
        newUser.userId = req.body.userId
        newUser.userDisplayName = req.body.displayName
        newUser.profileImageUrl = req.body.profileImageUrl
        newUser.deleted = false

        this.userService.createUser(newUser)

        res.status(200).json()
    }
}

export function createUserController(userService) {
    return new UserController(userService);
}