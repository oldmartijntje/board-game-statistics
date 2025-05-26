import { QueueItemProgression } from "./queueItemProgression.interface";
import * as mongodb from "mongodb";

export interface RawQueueItemInterface {
    _id?: mongodb.ObjectId;
    _userId?: mongodb.ObjectId;
    tags?: object[];
    groups?: object[];
    uploadTime?: Date;
    progress?: QueueItemProgression;
    players: object[];
    locations: object[];
    games: object[];
    plays: object[];
    challenges?: object[];
    deletedObjects?: object[];
    userInfo: object;
}