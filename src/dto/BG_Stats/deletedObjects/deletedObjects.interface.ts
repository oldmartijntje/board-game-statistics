import { Schema } from "mongoose";
import * as mongodb from "mongodb";

export interface DeletedObjectInterface {
    _id?: mongodb.ObjectId;
    uuid: string;
    modificationDate: string;
    objectType: string;
    externalId: number;
    lastCloudSync: string;
}

export const deletedObjectSchema = new Schema<DeletedObjectInterface>({
    uuid: { type: String, required: true },
    modificationDate: { type: String, required: true },
    objectType: { type: String, required: true },
    externalId: { type: Number, required: true },
    lastCloudSync: { type: String, required: true }
});
