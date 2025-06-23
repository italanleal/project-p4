export class Artist {
    constructor(artistId, artistName) {
        this.artistId = artistId;
        this.artistName = artistName;
    }
}

export function createArtist(artistId, artistName) {
    return new Artist(
        artistId,
        artistName)
}