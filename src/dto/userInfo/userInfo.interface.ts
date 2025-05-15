import { Schema } from "mongoose";
import * as mongodb from "mongodb";

export interface UserInfo {
    meRefId: number;
    _meRefId?: mongodb.ObjectId;
    _id?: mongodb.ObjectId;
    bggUsername: string;
    exportDate: string;
    appVersion: string;
    systemVersion: string;
    device: string;
}

export const userInfoSchema = new Schema<UserInfo>({
    meRefId: { type: Number, required: true },
    bggUsername: { type: String, required: true },
    exportDate: { type: String, required: true },
    appVersion: { type: String, required: true },
    systemVersion: { type: String, required: true },
    device: { type: String, required: true }
});
