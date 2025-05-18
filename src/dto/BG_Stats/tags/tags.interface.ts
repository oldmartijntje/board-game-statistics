import * as mongodb from "mongodb";
import { Schema } from "mongoose";

export interface Tag {
    _id?: mongodb.ObjectId;
    uuid: string;
    id: number;
    name: string;
    type: string;
    group: string;
    isInternal: boolean;
    isDefault: boolean;
    isHidden: boolean;
    modificationDate: string;
    metaData?: string;
}

export const tagSchema = new Schema<Tag>({
    uuid: { type: String, required: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    group: { type: String, required: true },
    isInternal: { type: Boolean, required: true },
    isDefault: { type: Boolean, required: true },
    isHidden: { type: Boolean, required: true },
    modificationDate: { type: String, required: true },
    metaData: { type: String }
});
