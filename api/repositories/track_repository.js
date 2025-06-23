export class TrackRepository {
    constructor(conn) {
        this.conn = conn;
    }

    async createTrack(track) {
        const session = this.conn.getSession();

        try {
            const result = await session.run(
                `MERGE (t:Track { trackId: $trackId })
                ON CREATE SET t.trackName = $trackName, t.albumImageUrl = $albumImageUrl
                RETURN t`,
                {
                    trackId: track.trackId,
                    trackName: track.trackName,
                    albumImageUrl: track.albumImageUrl,
                })
            return result.records[0].get(0).properties;
        } finally {
            await session.close();
        }
    }

    async returnTrack(id) {
        const session = this.conn.getSession();
        try {
            const result = await session.run(
                `MATCH (t:Track {
                  trackId: $trackId 
                }) 
                RETURN t`,
                { trackId: id }
            );
            if (result.records.length === 0) {
                return null;
            }
            return result.records[0].get('t').properties;
        } finally {
            await session.close();
        }
    }
}

export function createTrackRepository(conn) {
    return new TrackRepository(conn);
}