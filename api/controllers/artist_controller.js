import { createUser } from "../models/user.js";
import { createArtist } from "../models/artist.js";

export class ArtistController{
    
       constructor(userService, trackService, artistService) {
        this.userService = userService;
        this.trackService = trackService;
        this.artistService = artistService;
    }

     async listensByArtist(req, res) {
        const artistId = req.params.artistID;
        if (!artistId) return res.status(400).json({ message: 'artistID é obrigatório.' });

        try {
            const result = await this.artistService.getGraphByArtistId(artistId)
        
            res.status(200).json({ data: result })
        } catch (error) {
            console.error('Erro em listensByArtist:', error);
            res.status(500).json({ error: error.message });
        }
    }

    

}

export function createArtistController(userService, trackService, artistService){
    return new ArtistController(userService, trackService, artistService)
}