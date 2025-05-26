import mongoose from "mongoose";
import { userJsonSchema } from "./dto/user/user.schema";
import { sessionTokenJsonSchema } from "./dto/sessionToken/sessionToken.schema";
import { hash } from 'bcrypt'
import { queueItemJsonSchema } from "./dto/queueItem/queueItem.schema";
import { playerSchema } from "./dto/BG_Stats/player/player.interface";
import { tagSchema } from "./dto/BG_Stats/tags/tags.interface";
import { playSchema } from "./dto/BG_Stats/plays/plays.interface";
import { locationSchema } from "./dto/BG_Stats/location/location.interface";
import { groupSchema } from "./dto/BG_Stats/group/group.interface";
import { gameSchema } from "./dto/BG_Stats/game/game.interface";
import { deletedObjectSchema } from "./dto/BG_Stats/deletedObjects/deletedObjects.interface";
import { challengeSchema } from "./dto/BG_Stats/challenges/challenges.interface";
import { userInfoSchema } from "./dto/BG_Stats/userInfo/userInfo.interface";

// This has to be done for all collections that we want to have JSON schema validation on
const sessionTokenSchema = new mongoose.Schema(sessionTokenJsonSchema);
export const sessionTokens = mongoose.model('sessionToken', sessionTokenSchema);

const queueItemSchema = new mongoose.Schema(queueItemJsonSchema);
export const queueItems = mongoose.model('queueItem', queueItemSchema);

export const userInfoTable = mongoose.model('_userInfo', userInfoSchema);
export const challengeTable = mongoose.model('_challenge', challengeSchema);
export const deletedObjectTable = mongoose.model('_deletedObject', deletedObjectSchema);
export const gameTable = mongoose.model('_game', gameSchema);
export const groupTable = mongoose.model('_group', groupSchema);
export const locationTable = mongoose.model('_location', locationSchema);
export const playTable = mongoose.model('_play', playSchema);
export const tagTable = mongoose.model('_tag', tagSchema);
export const playerTable = mongoose.model('_player', playerSchema);

export const userSchema = new mongoose.Schema(userJsonSchema);
userSchema.pre('save', async function (next) {
    const hashedPassword = await hash(this.password, 10)
    this.password = hashedPassword
    next()
})
export const users = mongoose.model('user', userSchema);

export async function connectToDatabase(uri: string) {
    const mongoose = require('mongoose');
    await mongoose.connect(uri);
} 