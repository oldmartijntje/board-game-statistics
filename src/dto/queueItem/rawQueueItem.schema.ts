import mongoose, { Schema } from "mongoose";

export const rawQueueItemJsonSchema = {
    _userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    uploadTime: { type: Date, default: Date.now },
    progress: { type: Schema.Types.Mixed, required: true },

    tags: [{ type: Schema.Types.Mixed }],
    groups: [{ type: Schema.Types.Mixed }],
    players: { type: [Schema.Types.Mixed], required: true },
    locations: { type: [Schema.Types.Mixed], required: true },
    games: { type: [Schema.Types.Mixed], required: true },
    plays: { type: [Schema.Types.Mixed], required: true },
    challenges: [{ type: Schema.Types.Mixed }],
    deletedObjects: [{ type: Schema.Types.Mixed }],
    userInfo: { type: Schema.Types.Mixed },
};