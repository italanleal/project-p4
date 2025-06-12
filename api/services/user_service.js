export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(user) {
        return await this.userRepository.createUser(user);
    }
}

export function createUserService(userRepository) {
    return new UserService(userRepository);
}