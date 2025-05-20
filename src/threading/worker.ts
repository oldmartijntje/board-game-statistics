import workerMessage from '../../src/dto/workerMessage/workerMessage.interface';
import { connectToDatabase, queueItems } from '../../src/mainDatabase';
import { parentPort, workerData } from 'worker_threads';
import { WorkerEnum } from './WorkerEnum';
import { PlaySubmitter } from '../models/PlaySubmitter';
import { QueueItemInterface } from '../../src/dto/queueItem/queueItem.interface';
import { DataExtractor } from '../../src/models/DataExtractor';

const { MONGO_URI } = process.env;

if (!parentPort) {
    throw new Error('No parentPort');
}

let stepId: NodeJS.Timeout = undefined;

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
    }
    let dataExtractor = new DataExtractor();
    let queueItem: QueueItemInterface = optionalQueueItem;

}



parentPort.on('message', async (data: workerMessage) => {
    if (data.type == WorkerEnum.GetStatus) {
        // add logic here
    }
});