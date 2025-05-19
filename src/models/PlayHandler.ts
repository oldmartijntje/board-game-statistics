import { RawQueueItemInterface } from "../dto/queueItem/rawQueueItem.interface";
import * as mongodb from "mongodb";
import { users, queueItems } from "../mainDatabase";
import { UserInterface } from "../../src/dto/user/user.interface";
import { ReturnValueInterface } from "../../src/dto/returnValue/returnValue.interface";


export class PlayHandler {
    constructor() {

    }

    public async Upload(item: RawQueueItemInterface, user: UserInterface): Promise<ReturnValueInterface> {
        return;
    }

    public IsValidDataFormat(obj: any): ReturnValueInterface {
        if (obj &&
            typeof obj.players === 'object' &&
            typeof obj.locations === 'object' &&
            typeof obj.plays === 'object' &&
            typeof obj.userInfo === 'object' &&
            typeof obj.games === 'object') {
            return {
                error: false,
                message: "kk",
                statusCode: 200
            }
        } else {
            return {
                error: true,
                message: "'players', 'locations', 'plays', 'userInfo' and 'games' are required",
                statusCode: 400
            }
        }
    }

    public ValidateDataFormat(data: any): RawQueueItemInterface {
        if (this.IsValidDataFormat(data)) {
            return {
                players: data.players,
                locations: data.locations,
                games: data.games,
                plays: data.plays,
                userInfo: data.userInfo,
                tags: data.tags,
                groups: data.groups,
                challenges: data.challenges,
                deletedObjects: data.deletedObjects
            }
        } else {
            return {
                players: undefined,
                locations: undefined,
                games: undefined,
                plays: undefined,
                userInfo: undefined
            }
        }
    }
}