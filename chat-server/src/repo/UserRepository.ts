import { User } from "../entity/User"
import { Repository, EntityRepository } from "typeorm"


@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    async findFriendsForUser(userId: number) {
        const user = await this.findOneOrFail({
            where: {id: userId},
            relations: ['friends']
        })
        return user.friends
    }

    async addFriend(user1Id: number, user2Id: number) {
        const user1 = await this.findOneOrFail({
            where: {id: user1Id},
            relations: ['friends']
        })

        const user2 = await this.findOneOrFail({id: user2Id})
        user1.friends.push(user2)
        return this.save(user1)
    }

    async removeFriend(user1Id: number, user2Id: number) {
        const user = await this.findOneOrFail({
            where: {id: user1Id},
            relations: ['friends']
        })

        // remove the friend
        user.friends = user.friends.filter(u => u.id !== user2Id)
        return this.save(user)
    }

    async removeUser(userId: number) {
        const user = await this.findOneOrFail({id: userId})
        this.remove(user)
        return user.id
    }
}