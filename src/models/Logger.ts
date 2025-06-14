class LogObject<T> {
    logger: Logger<T>
    stringified: string

    constructor(logger: Logger<T>, stringified: string) {
        this.logger = logger;
        this.stringified = stringified;
    }

    public LogError() {
        this.logger.LogError(this.stringified);
    }

    public LogWarning() {
        this.logger.LogWarning(this.stringified);
    }

    public LogInfo() {
        this.logger.LogInfo(this.stringified);
    }
}


export class Logger<T> {
    public StringifyObject(obj: any): LogObject<T> {
        return new LogObject<T>(this, JSON.stringify(obj))
    }

    private FormatLevelForConsole(message: string, level: number) {
        switch (level) {
            case 0:
                console.log(`[LOG] ${message}`);
                return;
            case 1:
                console.warn(`[WARNING] ${message}`);
                return;
            case 3:
                console.error(`[ERROR] ${message}`);
                return;
        }
    }

    private LogMessage(message: string, level?: number) {

    }

    public LogInfo(message:string) {
        this.LogMessage(message, 0)
    }

    public LogWarning(message:string) {
        this.LogMessage(message, 1)
    }

    public LogError(message:string) {
        this.LogMessage(message, 3)
    }
}