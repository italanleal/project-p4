export class ArtistRepository {
    constructor(conn) {
        this.conn = conn;
    }

    async createArtist(artist) {
        const session = this.conn.getSession();

        try {
            const result = await session.run(
                `MERGE (a:Artist { artistId: $artistId })
                ON CREATE SET a.artistName = $artistName
                RETURN a`,
                {
                    artistId: artist.artistId,
                    artistName: artist.artistName
                })
            return result.records[0].get(0).properties;
        } finally {
            await session.close();
        }
    }

    async returnArtist(id) {
        const session = this.conn.getSession();
        try {
            const result = await session.run(
                `MATCH (a:Artist {
                  artistId: $artistId 
                }) 
                RETURN a`,
                { artistId: id }
            );
            if (result.records.length === 0) {
                return null;
            }
            return result.records[0].get('a').properties;
        } finally {
            await session.close();
        }
    }

    async artistsAuthorsTrack(artists, trackId){
        const session = this.conn.getSession();
        try {
            const result = await session.run(
                `UNWIND $artists as artist
                MATCH (a:Artist { artistId: artist.artistId })
                MATCH (t:Track { trackId: $trackId })
                MERGE (a)-[:AUTHORS]->(t)`,
                {
                    artists: artists,
                    trackId: trackId
                }
            );
        } finally {
            await session.close();
        }
    }
}

export function createArtistRepository(conn) {
    return new ArtistRepository(conn);
}