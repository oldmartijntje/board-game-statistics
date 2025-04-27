const mqtt = require('mqtt');
const fs = require('fs');
const express = require("express");

const appRouter = express.Router();
appRouter.use(express.json());

appRouter.post("/scanMqtt", async (req, res) => {
    try {
        res.status(200).send("ok");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

appRouter.get("/getScanData", async (_req, res) => {
    try {
        res.status(200).send("ok");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

appRouter.post("/displayItems", async (_req, res) => {
    try {

    } catch (error) {
        res.status(500).send(error.message);
    }
});

appRouter.put("/displayItems", async (_req, res) => {

});

module.exports = {
    appRouter: appRouter
}