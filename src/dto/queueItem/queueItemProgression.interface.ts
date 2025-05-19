import * as mongodb from "mongodb";
export interface QueueItemProgression {
    hasStarted: boolean;
    completed: number;
    estimatedTodo: number;
    errors: mongodb.ObjectId[];
}