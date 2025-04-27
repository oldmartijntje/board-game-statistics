import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./mainDatabase";
import { loginRouter } from "./controllers/login.routes";
import { Worker, MessageChannel } from 'worker_threads';

// Load environment variables from the .env file, where the MONGO_URI is configured
// my localhost .env: "MONGO_URI=mongodb://localhost:27017/BG_STATS_WEB"
dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
    console.error("No MONGO_URI environment variable has been defined in config.env");
    process.exit(1);
}

connectToDatabase(MONGO_URI)
    .then(async () => {
        const app = express();
        app.use(cors());
        app.use("/login", loginRouter);
        // start the Express server
        app.listen(5200, () => {
            console.log(`Server running at http://localhost:5200...`);
        });

    })
    .catch(error => console.error(error));