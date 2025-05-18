import { WorkerEnum } from '../../../src/threading/WorkerEnum';
import { Worker, MessageChannel, MessagePort } from 'worker_threads';
export default interface workerMessage {
    port: MessagePort;
    value: any;
    type: WorkerEnum;
}