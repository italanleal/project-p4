import {createUser} from "../models/user.js";

export class UserController {
    constructor(userService, trackService) {
        this.userService = userService;
        this.trackService = trackService;
    }
    async createUser(req, res) {
        const newUser = createUser(req.body.userId, req.body.displayName, req.body.profileImageUrl, false)

        try {
            await this.userService.createUser(newUser)
        } catch (error) {
            res.status(409).json({ error: error.message })
            return
        }

        res.status(201).json({})
    }

    async graphUserData(req, res) {
        const access_token = req.headers.authorization.split(' ')[1]

        if (!access_token) return res.status(401).json({ message: 'Token de acesso não fornecido.' })
        try {
            const user_data = await (await fetch('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${access_token}` },
            })).json()

            const tracks_data = await (await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50&offset=0', {
                method: 'GET',
                headers: { Authorization: `Bearer ${access_token}` }
            })).json()

            const userId = user_data.id

            const tracks = tracks_data.items.map(track => {
                return {
                    trackId: track.id,
                    trackName: track.name,
                    albumImageUrl: track.album.images[0].url
                }
            })

            const results = await Promise.all(
                tracks.map(async (track) => {
                    try {
                        return await this.trackService.createTrack(track);
                    } catch (err) {
                        return track
                    }
                })
            );

            await Promise.all(results.map(track => this.userService.userListenToTrack(userId, track.trackId)))

            res.status(200).json({})
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }
    }
}

export function createUserController(userService, trackService) {
    return new UserController(userService, trackService);
}