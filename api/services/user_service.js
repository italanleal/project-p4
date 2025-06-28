import { createUser } from "../models/user.js";


export class UserService {
    constructor(userRepository, trackRepository) {
        this.userRepository = userRepository;
    }
    async createUser(user) {
        try {
            const u = await this.userRepository.returnUser(user.userId);
            if (!u) {
                return await this.userRepository.createUser(user);
            }
        } catch (e) {
            throw e
        }
        throw new Error('User already exists');

    }
    async updateUser(userId, update){

        const u = await this.userRepository.returnUser(userId);
        if (!u) {
            throw new Error("User does not exist")
        }

        const userDisplayName = update.userDisplayName != null ? update.userDisplayName : u.userDisplayName
        const profileImageUrl = update.profileImageUrl != null ? update.profileImageUrl : u.profileImageUrl
        const biography = update.biography != null ? update.biography : u.biography
 
        const updatedUser = createUser(userId, userDisplayName, profileImageUrl, biography)

       return await this.userRepository.updateUser(userId, updatedUser);

        }

    async deleteUser(userId) {
  // opcional: verifica se existe antes
    const u = await this.userRepository.returnUser(userId);
    if (!u) {
    throw new Error('Usuário não encontrado');
  }

    return await this.userRepository.deleteUser(userId);
    }
 
       
    async returnUser(id){
        return await this.userRepository.returnUser(id)
    }

    async returnArtistsByUser(id){
        return await this.userRepository.returnArtistsByUser(id)
    }

    async returnTracksByUser(id){
        return await this.userRepository.returnTracksByUser(id)
    }

    async returnArtistsAndTracksByUser(id){
        return await this.userRepository.returnArtistsAndTracksByUser(id)
    }

    async userListenToTrack(userId, trackId) {
        return await this.userRepository.userListenToTrack(userId, trackId);
    }

    async returnMostListenedArtistsWithTracksFromUser(userId){
        return await this.userRepository.returnMostListenedArtistsWithTracksFromUser(userId);
    }
  
}

export function createUserService(userRepository) {
    return new UserService(userRepository);
}