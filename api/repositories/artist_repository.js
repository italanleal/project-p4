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
                    artistName: artist.artistName,
                    artistImageUrl: artist.artistImageUrl,
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
    async fetchByArtistId(artistId) {
        const session = this.conn.getSession();
        try {
            const result = await session.run(
                `
                MATCH (a:Artist {artistId: $artistId})-[r1:AUTHORS]->(t:Track)
                MATCH (u:User)-[r2:LISTEN_TO]->(t)
                RETURN a, r1, t, r2, u
                `,
                { artistId }
            );
            return result.records; 

        } finally{
            await session.close();
        }
    }

    async renderNetwork() {

        const session = this.conn.getSession();
        try {
            const result = await session.run(
                `CALL () {
                
                    MATCH (u:User)-[:LISTEN_TO]->(t:Track)<-[:AUTHORS]-(a:Artist)
                    WITH a, COUNT(DISTINCT u) AS user_count
                    WHERE user_count > 1
                    WITH DISTINCT a
                    MATCH (a)-[:AUTHORS]->(t:Track)<-[:LISTEN_TO]-(u:User)
                    RETURN DISTINCT u AS user, t, a

                    UNION
                    MATCH (u:User)-[:LISTEN_TO]->(t:Track)<-[:AUTHORS]-(a:Artist)
                    WITH u, a, COUNT(DISTINCT t) AS tracks_per_artist
                    
                    CALL (u) {
                        MATCH (u)-[:LISTEN_TO]->(t2:Track)<-[:AUTHORS]-(a2:Artist)
                        WITH u, a2, COUNT(DISTINCT t2) AS tp
                        RETURN u AS user, AVG(tp) AS avg_tracks_by_user
                    }
                    
                    WITH u, a, tracks_per_artist, user, avg_tracks_by_user
                    WHERE u = user AND tracks_per_artist > avg_tracks_by_user + 2
                    MATCH (u)-[:LISTEN_TO]->(t:Track)<-[:AUTHORS]-(a)
                    RETURN DISTINCT u AS user, t, a
                }

                MATCH (t)<-[r2:AUTHORS]-(allArtists:Artist)
                MATCH (user)-[r1:LISTEN_TO]->(t)
                RETURN DISTINCT user as u, r1, t, r2, allArtists AS a`
            )
            return result.records
        } finally {
            await session.close();
        }

    }

    async returnArtistsIndex() {
        const session = this.conn.getSession();
        try {
            const result = await session.run(
                `MATCH (a:Artist) 
                RETURN a.artistId AS artistId, a.artistName AS artistName, a.artistImageUrl AS artistImageUrl`
            );
            return result.records.map(record => ({
                artistId: record.get('artistId'),
                name: record.get('artistName'),
                artistImageUrl: record.get('artistImageUrl'),
            }));
        } finally{
            await session.close();
        }
    }

    async renderNetworkFilterByArtists(artists) {
        const session = this.conn.getSession();
        try {
            const result = await session.run(
                `MATCH (u:User)-[r1:LISTEN_TO]->(t:Track)<-[r2:AUTHORS]-(a:Artist)
                WHERE a.artistId IN $artists
                RETURN u, r1, t, r2, a`,
                { artists: artists }
            )
            return result.records
        } finally {
            await session.close();
        }
    }
}

export function createArtistRepository(conn) {
    return new ArtistRepository(conn);
}