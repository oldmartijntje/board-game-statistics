import {ReturnValueInterface} from "../dto/returnValue/returnValue.interface";
import {DataExtractor} from "./DataExtractor";
import {Logger, LoggerGaslighter} from "./Logger";


export abstract class BaseItemSaver {
    // make sure to create a new id whenever an Id is smaller than 0
    // this is important
    private readonly dataExtractor: DataExtractor;
    private logger: Logger<any>;
    constructor(dataExtr: DataExtractor) {
        this.dataExtractor = dataExtr;
        this.logger = new LoggerGaslighter().CreateGaslightedLogger(this.constructor.name);
        this.logger.LogInfo("Initiated ItemSaver");
    }
    abstract SendItemToDataBase(): Promise<ReturnValueInterface>;
    abstract DependencyProvider(): Promise<ReturnValueInterface>;
}

export class TagItemSaver extends BaseItemSaver{
    async DependencyProvider(): Promise<ReturnValueInterface> {
        // here we loop through the users and other dicts to check on who depends on the submitted item.
        return {
            data: undefined, error: true, message: "Method not Implemented.", statusCode: 500
        }
    }
    async SendItemToDataBase(): Promise<ReturnValueInterface> {
        return {
            data: undefined, error: true, message: "Method not Implemented.", statusCode: 500
        }
    }

}