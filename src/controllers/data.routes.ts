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
        const username = _req.body.username;
        const sessionToken = _req.body.sessionToken;
        const data = _req.body.data;
        if (!sessionToken || !data || !username) {
            res.status(400).send({ "message": "Session token, data and username are required" });
            return;
        }
        const auth = new Authenticator();
        const authenticationResponse = await auth.authenticateBySessionToken(username, sessionToken, false);
        if (!authenticationResponse) {
            res.status(403).send({ "message": "Invalid SessionToken and username combination." });
            return;
        }




        res.status(200).send({ "message": "Login Successfull." })
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