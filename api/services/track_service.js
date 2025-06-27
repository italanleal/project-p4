export class TrackService {
    constructor(trackRepository) {
        this.trackRepository = trackRepository;
    }
    async createTrack(track) {
        const t = await this.trackRepository.returnTrack(track.trackId);
        if (t) {
            throw new Error('Track already exists');
        }
        return await this.trackRepository.createTrack(track);
    }
    async returnTrack(id) {
        return await this.trackRepository.returnTrack(id);
    }
    
}


export function createTrackService(trackRepository) {
    return new TrackService(trackRepository);
}