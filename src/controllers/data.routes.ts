import * as express from "express";
import { Authenticator } from "../models/Authenticator";
import { UuidHelper } from "../models/UuidHelper"

export const dataRouter = express.Router();
dataRouter.use(express.json());

/**
 * Upload a play
 */
dataRouter.post("/", async (_req, res) => {
    try {
        res.status(501).send({ "message": "Unexpected logic escape: How did this occur?" });
    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
});

/**
 * Export a play
 */
dataRouter.post("/export/play", async (_req, res) => {
    try {
        res.status(501).send({ "message": "Unexpected logic escape: How did this occur?" });
    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
});

/**
 * Full Export
 */
dataRouter.post("/export/all", async (_req, res) => {
    try {
        res.status(501).send({ "message": "Unexpected logic escape: How did this occur?" });
    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
});