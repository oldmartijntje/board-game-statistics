import workerMessage from '../../src/dto/workerMessage/workerMessage.interface';
import { connectToDatabase, queueItems } from '../../src/mainDatabase';
import { parentPort, workerData } from 'worker_threads';
import { WorkerEnum } from './WorkerEnum';
import { PlaySubmitter } from '../models/PlaySubmitter';
import { QueueItemInterface } from '../../src/dto/queueItem/queueItem.interface';
import { DataExtractor } from '../models/DataExtractor.js';


const { MONGO_URI } = process.env;

if (!parentPort) {
    throw new Error('No parentPort');
}

let stepId: NodeJS.Timeout = undefined;
let busy: boolean = false;
let log: any[] = [];
const MAX_LOG_LENGTH = 50;

console.log('Worker started');

connectToDatabase(MONGO_URI).then(async () => {
    console.log('Worker connected to Database')
    stepId = setInterval(() => {
        step().catch(err => console.error("Step error:", err));
    }, 1000 * 60)
    step()
});

let checkinTime: Date = undefined;

function logger(data: any) {
    log.push(data);
    let loops = 0;
    while (log.length > MAX_LOG_LENGTH) {
        if (loops > 10) {
            break;
        }
        log.shift();
        loops++
    }
}

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
        logger(response);
        busy = false;
        return;
    }

}



parentPort.on('message', async (data: workerMessage) => {
    if (data.type == WorkerEnum.GetStatus) {
        // add logic here
    }
});