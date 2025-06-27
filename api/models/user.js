export class User {
    constructor(userId, userDisplayName, profileImageUrl, biography, deleted) {
        this.userId = userId;
        this.userDisplayName = userDisplayName;
        this.profileImageUrl = profileImageUrl;
        this.biography = biography
    }
}

export function createUser(userId, userDisplayName, profileImageUrl, biography) {
    return new User(
        userId,
        userDisplayName,
        profileImageUrl,
        biography
        )
}