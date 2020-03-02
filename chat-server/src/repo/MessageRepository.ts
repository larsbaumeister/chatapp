import { Message } from "../entity/Message";
import { Repository, EntityRepository } from "typeorm";
import { User } from "../entity/User";

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {

    findMessageForChat(user1Id: number, user2Id: number) {
        return this.createQueryBuilder('message')
            .where(`
             (message.sender.id = :id1 AND message.receiver.id = :id2)
             OR 
             (message.sender.id = :id2 AND message.receiver.id = :id1)
            `, {id1: user1Id, id2: user2Id})
            .getMany()
    }

    findMessagesForUser(userId: number) {
        return this.createQueryBuilder('message')
            .where('message.sender.id = :userId OR message.receiver.id = :userId', { userId })
            .getMany()
    }

    findBySender(userId: number) {
        return this.find({senderId: userId})
    }

    findByReceiver(userId: number) {
        return this.find({senderId: userId})
    }

}