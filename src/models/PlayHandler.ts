import { RawQueueItemInterface } from "../dto/queueItem/rawQueueItem.interface";
import * as mongodb from "mongodb";
import { users, queueItems } from "../mainDatabase";
import { UserInterface } from "../../src/dto/user/user.interface";


export class PlayHandler {
    constructor() {

    }

    public async Upload(item: RawQueueItemInterface, user: UserInterface) {

    }
}