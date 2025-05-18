import workerMessage from '../../src/dto/workerMessage/workerMessage.interface';
import { connectToDatabase } from '../../src/mainDatabase';
import { parentPort, workerData } from 'worker_threads';
import { WorkerEnum } from './WorkerEnum';

const { MONGO_URI } = process.env;

if (!parentPort) {
    throw new Error('No parentPort');
}
console.log('Worker started');
connectToDatabase(MONGO_URI).then(async () => {
    console.log('Worker connected to Database')
});

parentPort.on('message', async (data: workerMessage) => {
    if (data.type == WorkerEnum.GetStatus) {
        // add logic here
    }
});