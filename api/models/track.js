export class Track {
    constructor(trackId, trackName, albumImageUrl) {
        this.trackId = trackId;
        this.trackName = trackName;
        this.albumImageUrl = albumImageUrl;
    }
}

export function createTrack(trackId, trackName, albumImageUrl) {
    return new Track(
        trackId,
        trackName,
        albumImageUrl)
}