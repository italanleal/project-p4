export class User {
    constructor(userId, userDisplayName, profileImageUrl, deleted) {
        this.userId = userId;
        this.userDisplayName = userDisplayName;
        this.profileImageUrl = profileImageUrl;
        this.deleted = deleted;
    }
}

export function createUser(userId, userDisplayName, profileImageUrl, deleted) {
    return {
        userId,
        userDisplayName,
        profileImageUrl,
        deleted
    }
}