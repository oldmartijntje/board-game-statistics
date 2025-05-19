import * as express from "express";
import { Authenticator } from "../models/Authenticator";
import { UuidHelper } from "../models/UuidHelper"
import { globalData } from "../../src/server";
import { Worker, MessageChannel } from 'worker_threads';
import { WorkerEnum } from "../threading/WorkerEnum";
import WorkerMessage from "../../src/dto/workerMessage/workerMessage.interface";
import { PlayHandler } from "../../src/models/PlayHandler";
import { RawQueueItemInterface } from "../../src/dto/queueItem/rawQueueItem.interface";
import { ReturnValueInterface } from "../../src/dto/returnValue/returnValue.interface";

export const dataRouter = express.Router();
dataRouter.use(express.json());

/**
 * Upload a play
 */
dataRouter.post("/", async (_req, res) => {
    try {
        const username = _req.body.username;
        const sessionToken = _req.body.sessionToken;
        const data: any = _req.body.data;
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
        const user = auth.getUserData();
        if (user == undefined) {
            res.status(500).send({ "message": "¯\\_(ツ)_/¯" });
        }
        const handler = new PlayHandler();
        const validData: ReturnValueInterface = handler.IsValidDataFormat(data);
        if (validData.error) {
            res.status(validData.statusCode).send({ "message": validData.message, "data": validData.data });
        }
        const validatedData: RawQueueItemInterface = handler.ValidateDataFormat(data);
        const returnValue: ReturnValueInterface = await handler.Upload(validatedData, user)
        res.status(returnValue.statusCode).send({ "message": returnValue.message, "data": returnValue.data });
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

/**
 * Get Status of the Worker
 */
dataRouter.post("/status", async (_req, res) => {
    try {
        const timeoutTime = 10; // seconds the thread can wait before responding
        var sentResponse = false; // For timeouts
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
        const { port1, port2 } = new MessageChannel();
        const workerMessage: WorkerMessage = { type: WorkerEnum.GetStatus, value: {}, port: port1 }
        globalData.worker.postMessage(workerMessage, [port1]);
        port2.on("message", (message) => {
            if (sentResponse) return;
            sentResponse = true;
            res.status(200).send(message);
            return;
        });

        setTimeout(() => {
            if (!sentResponse) {
                sentResponse = true;
                res.status(408).send({ "message": "It took too long for the server to respond." });
                return;
            }
        }, 1000 * timeoutTime);

    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
});