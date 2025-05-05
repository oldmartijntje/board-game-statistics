import { Schema } from "mongoose";

export interface LocationTag {
    tagRefId: number;
    metaData?: string;
}

export interface Location {
    uuid: string;
    id: number;
    name: string;
    modificationDate: string;
    tags?: LocationTag[];
}

export const locationSchema = new Schema<Location>({
    uuid: { type: String, required: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    modificationDate: { type: String, required: true },
    tags: [{
        tagRefId: { type: Number, required: true },
        metaData: { type: String }
    }]
});
