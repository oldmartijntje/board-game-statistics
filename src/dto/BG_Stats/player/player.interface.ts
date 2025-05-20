import { Schema } from "mongoose";
import * as mongodb from "mongodb";

export interface PlayerTagInterface {
    tagRefId: number;
    metaData?: string;
    _tagRefId: mongodb.ObjectId;
}

export interface PlayerInterface {
    _id?: mongodb.ObjectId;
    uuid: string;
    id: number;
    name: string;
    isAnonymous: boolean;
    modificationDate: string;
    bggUsername?: string;
    metaData?: string;
    tags?: PlayerTagInterface[];
}

export const playerSchema = new Schema<PlayerInterface>({
    uuid: { type: String, required: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    isAnonymous: { type: Boolean, required: true },
    modificationDate: { type: String, required: true },
    bggUsername: { type: String },
    metaData: { type: String },
    tags: [{
        tagRefId: { type: Number, required: true },
        metaData: { type: String }
    }]
});
