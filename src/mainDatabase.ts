import mongoose from "mongoose";
import { userJsonSchema } from "./dto/user/user.schema";
import { sessionTokenJsonSchema } from "./dto/sessionToken/sessionToken.schema";
import { hash } from 'bcrypt'
import { queueItemJsonSchema } from "./dto/queueItem/queueItem.schema";

// This has to be done for all collections that we want to have JSON schema validation on
const sessionTokenSchema = new mongoose.Schema(sessionTokenJsonSchema);
export const sessionTokens = mongoose.model('sessionToken', sessionTokenSchema);

const queueItemSchema = new mongoose.Schema(queueItemJsonSchema);
export const queueItems = mongoose.model('queueItem', queueItemSchema);

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