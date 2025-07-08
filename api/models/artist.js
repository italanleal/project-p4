export class Artist {
    constructor(artistId, artistName, artistImageUrl) {
        this.artistId = artistId;
        this.artistName = artistName;
        this.artistImageUrl = artistImageUrl;
    }
}

export function createArtist(artistId, artistName, artistImageUrl) {
    return new Artist(
        artistId,
        artistName,
        artistImageUrl)
}