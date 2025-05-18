import * as dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import fs from 'fs';
import express from "express";
import GlobalData from "./dto/globalData/globalData.interface"
import { Worker, MessageChannel } from 'worker_threads';
import { connectToDatabase } from "./mainDatabase";
import { loginRouter } from "./controllers/login.routes";
import { dataRouter } from "./controllers/data.routes";
import { static as expressStatic } from 'express';
import { VERSION_NUMBER } from './versionNr';

// Load environment variables from the .env file, where the MONGO_URI is configured
// my localhost .env: "MONGO_URI=mongodb://localhost:27017/BG_STATS_WEB"
dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
    console.error("No MONGO_URI environment variable has been defined in config.env");
    process.exit(1);
}

async function loadSettings(settingsPath: string) {
    try {
        const data = await fs.promises.readFile(settingsPath, 'utf8');
        const settings = JSON.parse(data);
        return settings;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Settings file not found: ${settingsPath}`);
        } else if (error instanceof SyntaxError) {
            console.error(`Error decoding JSON from settings file: ${settingsPath}`);
        } else {
            console.error(`Error reading settings file: ${error.message}`);
        }
        return null;
    }
}

async function main() {
    const settings = await loadSettings('settings.json');

    if (!settings) {
        return;
    }
}

const worker = new Worker('./src/threading/worker.js', {
    workerData: {
        path: './worker.ts',
    }
});

export const globalData: GlobalData = {
    worker: worker
}

main().then(async () => {
    connectToDatabase(MONGO_URI).then(async () => {
        const settings = require('../settings.json');
        const port = settings.port || 3000;
        const staticHtmlPath = path.join(__dirname, '../docs');
        const app = express();

        // set view engine to EJS
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '../views'));

        app.use(cors());
        app.use("/api/login", loginRouter);
        app.use("/api/data_center", dataRouter);
        app.use(expressStatic(staticHtmlPath));

        registerPages(app);

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}...`);
        });

        app.use((req, res) => {
            res.status(404).render('pages/404', { title: '404 Not Found' });
        });
    }).catch(error => console.error(error));

}).catch(error => console.error(error));

function registerPages(app: express.Express) {
    registerEJS(app, 'pages/index', '/', { title: 'Home' });
    registerEJS(app, 'pages/login', '/login', { title: 'Login' });
    registerEJS(app, 'pages/register', '/register', { title: 'Register' });
    registerEJS(app, 'pages/dashboard/dashboard', '/dashboard', { title: 'Dashboard' });
    registerEJS(app, 'pages/dashboard/dataCenter', '/data_center', { title: 'Data Center' });
    registerEJS(app, 'pages/dashboard/engine', '/engine', { title: 'Engine' });
}

function registerEJS(app: express.Express, folderPath: string, browserPath: string, options: any = {}) {
    options["versionNr"] = VERSION_NUMBER.readableFormat;
    options["versionDataStringified"] = JSON.stringify(VERSION_NUMBER);
    app.get(browserPath, (req, res) => {
        res.render(folderPath, options);
    });
}