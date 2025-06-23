export class UserService {
    constructor(userRepository, trackRepository) {
        this.userRepository = userRepository;
    }
    async createUser(user) {

        const u = await this.userRepository.returnUser(user.userId);
        if (u) {
            throw new Error('User already exists');
        }
        return await this.userRepository.createUser(user);
    }

    async userListenToTrack(userId, trackId) {
        return await this.userRepository.userListenToTrack(userId, trackId);
    }
}

export function createUserService(userRepository) {
    return new UserService(userRepository);
}