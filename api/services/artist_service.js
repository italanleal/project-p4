
export class ArtistService {
    constructor(artistRepository) {
        this.artistRepository = artistRepository;
    }
    async createArtist(artist) {
        const t = await this.artistRepository.returnArtist(artist.artistId);
        if (t) {
            throw new Error('Artist already exists');
        }
        return await this.artistRepository.createArtist(artist);
    }
    async returnTrack(id) {
        return await this.artistRepository.returnArtist(id);
    }

    async artistsAuthorsTrack(artists, trackId){
        await this.artistRepository.artistsAuthorsTrack(artists, trackId);
    }
    async getGraphByArtistId(artistId) {
    return await this.artistRepository.fetchByArtistId(artistId);
    }
}

export function createArtistService(artistRepository) {
    return new ArtistService(artistRepository);
}