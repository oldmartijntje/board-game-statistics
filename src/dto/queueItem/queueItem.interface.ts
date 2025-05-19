import * as mongodb from "mongodb";
import { QueueItemProgression } from "./queueItemProgression.interface";

export interface QueueItem {
    _id?: mongodb.ObjectId;
    _userId: mongodb.ObjectId;
    uploadTime: Date;
    estimatedLoops: Number;
    progress: QueueItemProgression;
    tags?: object;
    groups?: object;
    players?: object;
    locations?: object;
    games?: object;
    plays?: object;
    challenges?: object;
    deletedObjects?: object;
    userInfo?: object;
}