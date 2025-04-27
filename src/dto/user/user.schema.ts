import { Schema } from "mongoose";

export const userJsonSchema = {
    username: {
        type: String,
        required: true,
        description: "'name' is required and is a string",
    },
    password: {
        type: String,
        required: true,
        description: "'password' is required and is a string",
    },
    email: {
        type: String,
        required: false,
        description: "'email' is optional and is a string",
    },
    role: {
        type: String,
        required: false,
        description: "'role' is optional and is a string",
    },
    tenantIdentifiers: {
        type: [Schema.Types.ObjectId],
        required: true,
        description: "'tenantIdentifiers' is required and is a list of  valid ObjectId's",
    },

};