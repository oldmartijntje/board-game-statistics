import mongoose, { Schema } from "mongoose";

export const queueItemJsonSchema = {
    _userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    uploadTime: { type: Date, required: true },
    estimatedLoops: { type: Number, required: true },
    progress: { type: Schema.Types.Mixed, required: true },

    tags: { type: Schema.Types.Mixed },
    groups: { type: Schema.Types.Mixed },
    players: { type: Schema.Types.Mixed },
    locations: { type: Schema.Types.Mixed },
    games: { type: Schema.Types.Mixed },
    plays: { type: Schema.Types.Mixed },
    challenges: { type: Schema.Types.Mixed },
    deletedObjects: { type: Schema.Types.Mixed },
    userInfo: { type: Schema.Types.Mixed },
};