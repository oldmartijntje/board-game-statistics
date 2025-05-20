import { Schema } from "mongoose";
import * as mongodb from "mongodb";

export interface PlayPlayerScoreInterface {
    score: string | null;
    winner: boolean;
    newPlayer: boolean;
    startPlayer: boolean;
    playerRefId: number;
    _playerRefId: mongodb.ObjectId;
    role?: string;
    rank: number;
    seatOrder: number;
    metaData?: string;
    team?: string;
    startPosition?: string;
}

export interface PlayExpansionInterface {
    gameRefId?: number;
    _gameRefId: mongodb.ObjectId;
    bggId?: number;
}

export interface PlayInterface {
    _id?: mongodb.ObjectId;
    uuid: string;
    modificationDate: string;
    entryDate: string;
    playDate: string;
    usesTeams: boolean;
    durationMin: number;
    ignored: boolean;
    manualWinner: boolean;
    rounds: number;
    bggId: number;
    bggLastSync?: string;
    importPlayId: number;
    scoresheet?: string;
    locationRefId?: number;
    _locationRefId: mongodb.ObjectId;
    gameRefId: number;
    _gameRefId: mongodb.ObjectId;
    board?: string;
    rating: number;
    nemestatsId: number;
    scoringSetting: number;
    metaData?: string;
    playerScores: PlayPlayerScoreInterface[];
    expansionPlays: PlayExpansionInterface[];
    playImages?: string[];
    comments?: string;
}

export const playSchema = new Schema<PlayInterface>({
    uuid: { type: String, required: true },
    modificationDate: { type: String, required: true },
    entryDate: { type: String, required: true },
    playDate: { type: String, required: true },
    usesTeams: { type: Boolean, required: true },
    durationMin: { type: Number, required: true },
    ignored: { type: Boolean, required: true },
    manualWinner: { type: Boolean, required: true },
    rounds: { type: Number, required: true },
    bggId: { type: Number, required: true },
    bggLastSync: { type: String },
    importPlayId: { type: Number, required: true },
    scoresheet: { type: String },
    locationRefId: { type: Number },
    gameRefId: { type: Number, required: true },
    board: { type: String },
    rating: { type: Number, required: true },
    nemestatsId: { type: Number, required: true },
    scoringSetting: { type: Number, required: true },
    metaData: { type: String },
    playerScores: [{
        score: { type: Schema.Types.Mixed },
        winner: { type: Boolean, required: true },
        newPlayer: { type: Boolean, required: true },
        startPlayer: { type: Boolean, required: true },
        playerRefId: { type: Number, required: true },
        role: { type: String },
        rank: { type: Number, required: true },
        seatOrder: { type: Number, required: true },
        metaData: { type: String },
        team: { type: String },
        startPosition: { type: String }
    }],
    expansionPlays: [{
        gameRefId: { type: Number },
        bggId: { type: Number }
    }],
    playImages: [{ type: String }],
    comments: { type: String }
});
