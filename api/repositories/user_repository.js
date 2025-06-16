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
                   deleted: $deleted
                 }) 
                 RETURN u`,
                {
                    userId: user.userId,
                    userDisplayName: user.userDisplayName,
                    profileImageUrl: user.profileImageUrl,
                    deleted: user.deleted
                })
            return result.records[0].get(0).properties;
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
                `
                MATCH (u:User { userId: $userId })
                 
                MATCH (t:Track { trackId: $trackId })
                
                MERGE (u)-[:LISTEN_TO]->(t)
                `,
                { userId: userId, trackId: trackId }
            )
        } finally {
            await session.close();
        }
    }
}

export function createUserRepository(conn) {
    return new UserRepository(conn);
}