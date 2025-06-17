import workerMessage from '../../src/dto/workerMessage/workerMessage.interface';
import { connectToDatabase, queueItems } from '../../src/mainDatabase';
import { parentPort, workerData } from 'worker_threads';
import { WorkerEnum } from './WorkerEnum';
import { DataExtractor } from '../models/DataExtractor';
import {LoggerGaslighter} from "../models/Logger";
import {QueueItemInterface} from "../dto/queueItem/queueItem.interface";


const { MONGO_URI } = process.env;

if (!parentPort) {
    throw new Error('No parentPort');
}

let stepId: NodeJS.Timeout = undefined;
let busy: boolean = false;
let log: any[] = [];
const MAX_LOG_LENGTH = 50;
let logger = new LoggerGaslighter().CreateGaslightedLogger("worker.ts");

console.log('Worker started');

connectToDatabase(MONGO_URI).then(async () => {
    console.log('Worker connected to Database')
    stepId = setInterval(() => {
        step().catch(err => console.error("Step error:", err));
    }, 1000 * 60)
    step()
});

let checkinTime: Date = undefined;

async function step() {
    // clearInterval(stepId); // stop the repetition
    if (busy) {
        return;
    }
    busy = true;
    checkinTime = new Date(Date.now());
    console.log(`Worker check-in at ${checkinTime}`);
    let optionalQueueItem: QueueItemInterface | null = null;
    try {
        optionalQueueItem = await queueItems.findOne();
        if (!optionalQueueItem) {
            return;
        }
    } catch (error) {
        console.error("Error fetching queue item:", error);
        busy = false;
        return;
    }
    let queueItem: QueueItemInterface = optionalQueueItem;
    let dataExtractor = new DataExtractor(queueItem);
    let response = await dataExtractor.CheckAllDicts();
    if (!(response?.data?.continue)) {
        logger.StringifyObject(response).LogInfo();
        busy = false;
        return;
    }
    let response2 = await dataExtractor.HandleNext(5);
    if (response2.error) {
        logger.StringifyObject(response2).LogInfo();
        busy = false;
        return;
    }
    logger.StringifyObject(response2).LogInfo();

}



parentPort.on('message', async (data: workerMessage) => {
    if (data.type == WorkerEnum.GetStatus) {
        // add logic here
    }
});