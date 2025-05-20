import { RawQueueItemInterface } from "../dto/queueItem/rawQueueItem.interface";
import * as mongodb from "mongodb";
import { users, queueItems } from "../mainDatabase";
import { UserInterface } from "../dto/user/user.interface";
import { ReturnValueInterface } from "../dto/returnValue/returnValue.interface";
import { QueueItemInterface } from "../dto/queueItem/queueItem.interface";


export class PlaySubmitter {
    constructor() {

    }

    /**
     * Counts the number of items in a list and ignores undefineds
     *
     * @param list - A list or undefined.
     * @returns Number of items in the list or 0
     */
    private countItems<T>(list: T[] | undefined): number {
        return list?.length ?? 0;
    }

    /**
     * Upload an RawQueueItemInterface to mongodb
     * @param item the RawQueueItemInterface
     * @param user you, loggedin
     * @returns Promise<ReturnValueInterface>
     */
    public async Upload(item: RawQueueItemInterface, user: UserInterface): Promise<ReturnValueInterface> {
        if (user._id == undefined) {
            return {
                error: true,
                message: "Somehow evaded login? But you got caught.",
                statusCode: 401
            }
        }
        let count = 0;
        count += this.countItems(item.players);
        count += this.countItems(item.locations);
        count += this.countItems(item.games);
        count += this.countItems(item.plays);
        count += this.countItems(item.tags);
        count += this.countItems(item.groups);
        count += this.countItems(item.challenges);
        count += this.countItems(item.deletedObjects);
        count += item.deletedObjects != undefined ? 1 : 0
        const queueItemInterface: QueueItemInterface = {
            _userId: user._id,
            progress: {
                hasStarted: false,
                completed: 0,
                estimatedTodo: count,
                errors: []
            },
            players: item.players,
            locations: item.locations,
            games: item.games,
            plays: item.plays,
            userInfo: item.userInfo,
            tags: item.tags,
            groups: item.groups,
            challenges: item.challenges,
            deletedObjects: item.deletedObjects
        }
        try {
            const newQueueItem = await queueItems.create(queueItemInterface);
            if (!newQueueItem) {
                throw new Error('Failed to create queue item: returned null or undefined');
            }
        } catch (e) {
            return {
                error: true,
                message: e,
                statusCode: 500
            }
        }

        return {
            error: false,
            message: "Queue Item created!",
            statusCode: 200
        }
    }

    /**
     * Checks whether or not your `any` object is a valid RawQueueItemInterface
     * @param obj 
     * @returns ReturnValueInterface
     */
    public IsValidDataFormat(obj: any): ReturnValueInterface {
        if (obj &&
            Array.isArray(obj?.players) &&
            Array.isArray(obj?.locations) &&
            Array.isArray(obj?.plays) &&
            obj?.userInfo != undefined &&
            Array.isArray(obj?.games)) {
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

    /**
     * Converts your `any` object to RawQueueItemInterface
     * @param data 
     * @returns RawQueueItemInterface
     */
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
                players: [],
                locations: [],
                games: [],
                plays: [],
                userInfo: []
            }
        }
    }
}