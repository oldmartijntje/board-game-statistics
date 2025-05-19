import * as mongodb from "mongodb";
import { QueueItemProgression } from "./queueItemProgression.interface";

export interface QueueItemInterface {
    _id?: mongodb.ObjectId;
    _userId: mongodb.ObjectId;
    uploadTime: Date;
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