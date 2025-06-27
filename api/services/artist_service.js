
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

    async artistsAuthorsTrack(artists, trackId) {
        await this.artistRepository.artistsAuthorsTrack(artists, trackId);
    }

    async getGraphByArtistId(artistId) {
        return await this.artistRepository.fetchByArtistId(artistId);

    }

    async returnArtistsIndex() {
        try {
            return await this.artistRepository.returnArtistsIndex()
        } catch (e) {
            throw new Error('Erro ao acessar index de artistas')
        }

    }

    async renderNetwork(artists) {
        try {
            if (!artists || artists.length === 0) return await this.artistRepository.renderNetwork()
        } catch (error) {
            throw new Error('Erro ao renderizar rede')
        }

        try {
            return await this.artistRepository.renderNetworkFilterByArtists(artists)
        } catch (error) {
            throw new Error('Erro ao renderizar rede')
        }

    }
}

export function createArtistService(artistRepository) {
    return new ArtistService(artistRepository);
}