interface AppVersion {
    readableFormat: string;
    githubFormat: string; // the version it will be included by when releasing to github.
    dataFormat: number; // as reference number in the db, to know when we need to update it and how to update it.
    isReleased: boolean; // if we are still in alpha, it will be false
}

const VERSION_NUMBER: AppVersion = {
    readableFormat: "Alpha 1.0.0",
    githubFormat: "0.1.0",
    dataFormat: 0,
    isReleased: false
}

export { AppVersion, VERSION_NUMBER }