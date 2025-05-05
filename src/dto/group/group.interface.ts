import { Schema } from "mongoose";

export interface PlayerTag {
    tagRefId: number;
    metaData?: string;
}

export interface Player {
    uuid: string;
    id: number;
    name: string;
    isAnonymous: boolean;
    modificationDate: string;
    bggUsername?: string;
    metaData?: string;
    tags?: PlayerTag[];
}

export const playerSchema = new Schema<Player>({
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
