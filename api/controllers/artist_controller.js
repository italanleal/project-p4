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

    

}

export function createArtistController(artistService){
    return new ArtistController(artistService)
}