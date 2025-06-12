export class UserRepository {
    constructor(conn) {
        this.conn = conn;
    }

    async createUser(user) {
        const session = this.conn.getSession();

        try {
            const result = await session.run(
                `CREATE (u:User {
                   userId: {},
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
}

export function createUserRepository(conn) {
    return new UserRepository(conn);
}