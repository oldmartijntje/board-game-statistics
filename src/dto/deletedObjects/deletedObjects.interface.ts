import { Schema } from "mongoose";

export interface DeletedObject {
    uuid: string;
    modificationDate: string;
    objectType: string;
    externalId: number;
    lastCloudSync: string;
}

export const deletedObjectSchema = new Schema<DeletedObject>({
    uuid: { type: String, required: true },
    modificationDate: { type: String, required: true },
    objectType: { type: String, required: true },
    externalId: { type: Number, required: true },
    lastCloudSync: { type: String, required: true }
});
