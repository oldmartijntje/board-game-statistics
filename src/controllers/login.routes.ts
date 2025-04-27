import * as express from "express";
import { Authenticator } from "../models/authenticator";

export const loginRouter = express.Router();
loginRouter.use(express.json());

/**
 * Get the sessiontoken by using your password and username
 */
loginRouter.post("/", async (_req, res) => {
    try {
        const auth = new Authenticator();
        const username = _req.body.username;
        const password = _req.body.password;
        if (!username || !password) {
            res.status(400).send({ "message": "Username and password are required" });
            return;
        }
        await auth.authenticateByLogin(username, password)
        if (!auth.isAuthorised()) {
            res.status(403).send({ "message": "Invalid username and password combination." });
            return
        }
        const sessionToken = auth.getSessionToken();

        if (sessionToken) {
            res.status(200).send({ message: "Logged in succesfully", sessionToken: sessionToken });
            return;
        }
        res.status(501).send({ "message": "Unexpected logic escape: How did this occur?" });
    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
});

/**
 * check if your sessiontoken is valid.
 */
loginRouter.post("/validateToken", async (_req, res) => {
    try {
        const sessionToken = _req.body.sessionToken;
        if (!sessionToken) {
            res.status(400).send({ "message": "Session token is required" });
            return;
        }
        const auth = new Authenticator();
        const authenticationResponse = await auth.authenticateBySessionToken(sessionToken);
        if (!authenticationResponse) {
            res.status(403).send({ "message": "Invalid SessionToken" });
            return;
        }

        res.status(200).send({ "message": "Login Successfull." })
    } catch (error) {
        res.status(500).send(error.message);
    }
});