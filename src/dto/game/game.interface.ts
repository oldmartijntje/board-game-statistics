import { Schema } from "mongoose";

export interface GameCopy {
    uuid?: string;
    modificationDate?: string;
    metaData?: string;
    bggCollId?: number;
    statusOwned?: boolean;
    statusWishlist?: boolean;
    statusWantToPlay?: boolean;
    statusWantInTrade?: boolean;
    statusForTrade?: boolean;
    statusPrevOwned?: boolean;
    statusPreordered?: boolean;
    statusWantToBuy?: boolean;
    wishlistStatus?: number;
    bggUserName?: string;
    year?: number;
    urlImage?: string;
    urlThumb?: string;
    versionName?: string;
    bggVersionId?: number;
    gameName?: string;
}

export interface GameTag {
    tagRefId: number;
    metaData?: string;
}

export interface Game {
    uuid: string;
    id: number;
    name: string;
    modificationDate: string;
    cooperative: boolean;
    highestWins: boolean;
    noPoints: boolean;
    usesTeams: boolean;
    urlThumb?: string;
    urlImage?: string;
    bggName?: string;
    bggYear: number;
    bggId: number;
    designers?: string;
    metaData?: string;
    isBaseGame: number;
    isExpansion: number;
    rating: number;
    minPlayerCount: number;
    maxPlayerCount: number;
    minPlayTime: number;
    maxPlayTime: number;
    minAge: number;
    preferredImage: number;
    previouslyPlayedAmount: number;
    copies: GameCopy[];
    tags?: GameTag[];
}

export const gameSchema = new Schema<Game>({
    uuid: { type: String, required: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    modificationDate: { type: String, required: true },
    cooperative: { type: Boolean, required: true },
    highestWins: { type: Boolean, required: true },
    noPoints: { type: Boolean, required: true },
    usesTeams: { type: Boolean, required: true },
    urlThumb: { type: String },
    urlImage: { type: String },
    bggName: { type: String },
    bggYear: { type: Number, required: true },
    bggId: { type: Number, required: true },
    designers: { type: String },
    metaData: { type: String },
    isBaseGame: { type: Number, required: true },
    isExpansion: { type: Number, required: true },
    rating: { type: Number, required: true },
    minPlayerCount: { type: Number, required: true },
    maxPlayerCount: { type: Number, required: true },
    minPlayTime: { type: Number, required: true },
    maxPlayTime: { type: Number, required: true },
    minAge: { type: Number, required: true },
    preferredImage: { type: Number, required: true },
    previouslyPlayedAmount: { type: Number, required: true },
    copies: [{
        uuid: { type: String },
        modificationDate: { type: String },
        metaData: { type: String },
        bggCollId: { type: Number },
        statusOwned: { type: Boolean },
        statusWishlist: { type: Boolean },
        statusWantToPlay: { type: Boolean },
        statusWantInTrade: { type: Boolean },
        statusForTrade: { type: Boolean },
        statusPrevOwned: { type: Boolean },
        statusPreordered: { type: Boolean },
        statusWantToBuy: { type: Boolean },
        wishlistStatus: { type: Number },
        bggUserName: { type: String },
        year: { type: Number },
        urlImage: { type: String },
        urlThumb: { type: String },
        versionName: { type: String },
        bggVersionId: { type: Number },
        gameName: { type: String }
    }],
    tags: [{
        tagRefId: { type: Number },
        metaData: { type: String }
    }]
});
