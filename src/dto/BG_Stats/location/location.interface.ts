import { Schema } from "mongoose";
import * as mongodb from "mongodb";

export interface LocationTagInterface {
    tagRefId: number;
    _tagRefId: mongodb.ObjectId;
    metaData?: string;
}

export interface LocationInterface {
    _id?: mongodb.ObjectId;
    uuid: string;
    id: number;
    name: string;
    modificationDate: string;
    tags?: LocationTagInterface[];
}

export const locationSchema = new Schema<LocationInterface>({
    uuid: { type: String, required: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    modificationDate: { type: String, required: true },
    tags: [{
        tagRefId: { type: Number, required: true },
        metaData: { type: String }
    }]
});
