export class UserRepository {
    constructor(conn) {
        this.conn = conn;
    }

    async createUser(user) {
        const session = this.conn.getSession();

        try {
            const result = await session.run(
                `CREATE (u:User {
                   userId: $userId,
                   userDisplayName: $userDisplayName, 
                   profileImageUrl: $profileImageUrl, 
                   biography: user.biography
                 }) 
                 RETURN u`,
                {
                    userId: user.userId,
                    userDisplayName: user.userDisplayName,
                    profileImageUrl: user.profileImageUrl,
                    biography: user.biography,
                })
            return result.records[0].get(0).properties;
        } finally {
            await session.close();
        }
    }
    async updateUser(userId, update) {
        const session = this.conn.getSession();
        try {
            const result = await session.run(
                `MATCH (u:User { userId: $userId })
                SET u.userDisplayName = $userDisplayName,
                    u.profileImageUrl = $profileImageUrl,
                    u.biography = $biography
            
                 RETURN u`,
                {
                    userId,
                    userDisplayName: update.userDisplayName,
                    profileImageUrl: update.profileImageUrl,
                    biography: update.biography,

                }
            );
            if (result.records.length === 0) {
                return null;
            }

            return result.records[0].get("u").properties;
        } finally {
            await session.close();
        }
    }
    async deleteUser(userId) {
        const session = this.conn.getSession();

        try {
            const result = await session.run(
                `MATCH (u:User { userId: $userId }) DETACH DELETE u RETURN count(u) as deletedCount`,
                { userId }
            );

            const deletedCount = result.records[0].get('deletedCount').toNumber();
            return deletedCount > 0;  // true se deletou, false se não achou usuário

        } finally {
            await session.close();
        }
    }

    async returnUser(id) {
        const session = this.conn.getSession();

        try {
            const result = await session.run(
                `MATCH (u:User {
                  userId: $userId 
                }) 
                RETURN u`,
                { userId: id }
            );

            if (result.records.length === 0) {
                return null;
            }

            return result.records[0].get('u').properties;
        } finally {
            await session.close();
        }
    }

    async userListenToTrack(userId, trackId) {
        const session = this.conn.getSession();
        try {
            const result = await session.run(
                `MATCH (u:User { userId: $userId })
                MATCH (t:Track { trackId: $trackId })
                MERGE (u)-[:LISTEN_TO]->(t)`,
                { userId: userId, trackId: trackId }
            )
        } finally {
            await session.close();
        }
    }

    async returnMostListenedArtistsWithTracksFromUser(userId) {
        const session = this.conn.getSession();
        try {
            const result = await session.run(
                `MATCH (u:User { userId: $userId })-[:LISTEN_TO]->(t:Track)<-[:AUTHORS]-(a:Artist)
                WITH u, a, collect(DISTINCT t) AS tracks
                WHERE size(tracks) > 0
                UNWIND tracks AS t
                MATCH (u)-[r1:LISTEN_TO]->(t)<-[r2:AUTHORS]-(a)
                RETURN u, r1, t, r2, a`,
                { userId: userId }
            )
            return result.records
        } finally {
            await session.close();
        }

    }

}

export function createUserRepository(conn) {
    return new UserRepository(conn);
}