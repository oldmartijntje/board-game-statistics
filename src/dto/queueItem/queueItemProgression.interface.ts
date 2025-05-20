import * as mongodb from "mongodb";
export interface QueueItemProgression {
    hasStarted: boolean;
    completedItems: number;
    estimatedTodo: number;
    errors: mongodb.ObjectId[];
}