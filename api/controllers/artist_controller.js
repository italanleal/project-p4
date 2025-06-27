export class ArtistController{
       constructor(artistService) {
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

    async returnArtistsIndex(req, res) {
        try {
            const result = await this.artistService.returnArtistsIndex()
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async renderNetwork(req, res) {
        const artists = req.body.artists;
        try {
            const result = await this.artistService.renderNetwork(artists)
            res.status(200).json({ data: result })

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

}

export function createArtistController(artistService){
    return new ArtistController(artistService)
}