import { Schema } from "mongoose";
import * as mongodb from "mongodb";

export interface ChallengeGame {
    dontInclude: boolean;
    gameRefId: number;
    _gameRefId: mongodb.ObjectId;
}

export interface Challenge {
    _id?: mongodb.ObjectId;
    uuid: string;
    name: string;
    modificationDate: string;
    type: number;
    autoFill: boolean;
    startDate: string;
    endDate: string;
    hardCore: boolean;
    completed: boolean;
    value1: number;
    value2: number;
    playerUuids?: string[];
    metaData?: string;
    games: ChallengeGame[];
    excludedPlayUuids?: string;
}

export const challengeSchema = new Schema<Challenge>({
    uuid: { type: String, required: true },
    name: { type: String, required: true },
    modificationDate: { type: String, required: true },
    type: { type: Number, required: true },
    autoFill: { type: Boolean, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    hardCore: { type: Boolean, required: true },
    completed: { type: Boolean, required: true },
    value1: { type: Number, required: true },
    value2: { type: Number, required: true },
    playerUuids: [{ type: String }],
    metaData: { type: String },
    games: [{
        dontInclude: { type: Boolean, required: true },
        gameRefId: { type: Number, required: true }
    }],
    excludedPlayUuids: { type: String }
});
