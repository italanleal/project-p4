import { createUser } from "../models/user.js";
import { createArtist } from "../models/artist.js";

export class UserController {
    constructor(userService, trackService, artistService) {
        this.userService = userService;
        this.trackService = trackService;
        this.artistService = artistService;
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

            const tracks_data = await (await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50&offset=0', {
                method: 'GET',
                headers: { Authorization: `Bearer ${access_token}` }
            })).json()

            const userId = user_data.id

            const data = tracks_data.items.map(track => {
                return {
                    track: {
                        trackId: track.id,
                        trackName: track.name,
                        albumImageUrl: track.album.images[0].url
                    },
                    artists: track.artists

                }
            })

            const op1 = await Promise.all(
                data.map(async (d) => {
                    try {
                        return await this.trackService.createTrack(d.track);
                    } catch (err) {
                        return d.track
                    }
                })
            );

            const op2 = []
            for (const d of data) {
                op2.push(await Promise.all(d.artists.map(async artist => {
                    const a = createArtist(artist.id, artist.name)
                    try {
                        return await this.artistService.createArtist(a);
                    } catch (err) {
                        return a
                    }
                })))
            }

            await Promise.all(op2.map((artists, index) => this.artistService.artistsAuthorsTrack(artists, op1[index].trackId)))
            await Promise.all(op1.map(track => this.userService.userListenToTrack(userId, track.trackId)))

            res.status(200).json({})
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async topArtists(req, res) {
        const access_token = req.headers.authorization.split(' ')[1]

        if (!access_token) return res.status(401).json({ message: 'Token de acesso não fornecido.' })
        try {
            const user_data = await (await fetch('https://api.spotify.com/v1/me', {
                headers: { Authorization: `Bearer ${access_token}` },
            })).json()

            const userId = user_data.id

            const result = await this.userService.returnMostListenedArtistsWithTracksFromUser(userId)
            res.status(200).json({ data: result })

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    

}

export function createUserController(userService, trackService, artistService) {
    return new UserController(userService, trackService, artistService);
}