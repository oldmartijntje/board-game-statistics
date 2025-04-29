import { Schema, Types } from "mongoose";

const TagReferenceSchema = new Schema({
    _id: {
        type: Types.ObjectId,
        required: false,
    },
    _tagRefId: {
        type: Types.ObjectId,
        required: false,
    },
    tagRefId: {
        type: Number,
        required: true,
    },
    metaData: {
        type: Schema.Types.Mixed,
        required: true,
    },
}, {
    _id: false,
});

export const playerSchema = new Schema({
    uuid: {
        type: String,
        required: true,
        description: "'uuid' is required and is a string",
    },
    id: {
        type: Number,
        required: true,
        description: "'id' is required and is a number",
    },
    name: {
        type: String,
        required: true,
        description: "'name' is required and is a string",
    },
    isAnonymous: {
        type: Boolean,
        required: true,
        description: "'isAnonymous' is required and is a boolean",
    },
    modificationDate: {
        type: String,
        required: true,
        description: "'modificationDate' is required and is a string",
    },
    bggUsername: {
        type: String,
        required: false,  // Optional field
        description: "'bggUsername' is optional and is a string",
    },
    metaData: {
        type: Schema.Types.Mixed,  // Flexible data for metaData
        required: true,
    },
    tags: {
        type: [TagReferenceSchema],  // Embedding TagReferenceSchema
        required: false,  // Optional field
    },
}, {
    timestamps: true,  // Adds 'createdAt' and 'updatedAt' fields automatically
});