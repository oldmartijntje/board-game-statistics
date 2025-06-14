import { QueueItemInterface } from "../dto/queueItem/queueItem.interface";
import { QueueItemProgression } from "../dto/queueItem/queueItemProgression.interface";
import { ReturnValueInterface } from "../dto/returnValue/returnValue.interface";
import { playerTable, queueItems } from '../../src/mainDatabase';
import { ModelRedesigner } from "./ModelRedesigner";

enum processSelector {
    players,
    games,
    locations,
    tags,
    challenges,
    groups,
    deletedObjects,
    plays,
    userInfo,
    null
}

export class DataExtractor {
    loadedItem: QueueItemInterface;
    selectedProcess: processSelector;
    active: boolean = true;
    constructor(queueItemInterface: QueueItemInterface) {
        this.loadedItem = queueItemInterface;
    }

    /**
     * Check whether `this.active` is `false` in a `ReturnValueInterface` format
     * @returns 
     */
    private CheckActivity(): ReturnValueInterface {
        if (!this.active) {
            return {
                error: true,
                message: "Can't run after Submission",
                statusCode: 500
            }
        } else {
            return {
                error: false,
                message: "Ok",
                statusCode: 200
            }
        }
    }

    /**
     * Find the dict / list which we are going grab an item from.
     * Unless it is the first time this queueItem has been handled.
     * @returns Whether it succeeded or not
     */
    public async CheckAllDicts(): Promise<ReturnValueInterface> {
        if (this.CheckActivity().error) return this.CheckActivity();

        let progress: QueueItemProgression = this.loadedItem.progress;
        if (!progress.hasStarted) {
            progress.hasStarted = true;
            return await this.ConflictHandler();
        }

        if (this.loadedItem.players.length > 0) {
            this.selectedProcess = processSelector.players;
        } else if (this.loadedItem.games.length > 0) {
            this.selectedProcess = processSelector.games;
        } else if (this.loadedItem.locations.length > 0) {
            this.selectedProcess = processSelector.locations;
        } else if (this.loadedItem.tags != undefined && this.loadedItem.tags.length > 0) {
            this.selectedProcess = processSelector.tags;
        } else if (this.loadedItem.challenges != undefined && this.loadedItem.challenges.length > 0) {
            this.selectedProcess = processSelector.challenges;
        } else if (this.loadedItem.groups != undefined && this.loadedItem.groups.length > 0) {
            this.selectedProcess = processSelector.groups;
        } else if (this.loadedItem.deletedObjects != undefined && this.loadedItem.deletedObjects.length > 0) {
            this.selectedProcess = processSelector.deletedObjects;
        } else if (this.loadedItem.plays.length > 0) {
            this.selectedProcess = processSelector.plays;
        } else if (this.loadedItem.userInfo != undefined) {
            this.selectedProcess = processSelector.userInfo;
        } else {
            this.selectedProcess = processSelector.null;
        }

        return {
            error: false,
            message: "Added Item",
            statusCode: 200,
            data: { continue: true, date: new Date(Date.now()) }
        }
    }

    /**
     * 
     * @returns Whether it succeeded or not
     */
    public async HandleNext(): Promise<ReturnValueInterface> {
        if (this.CheckActivity().error) return this.CheckActivity();
        // make sure to create a new id whenever an Id is smaller than 0
        // this is important

    }

    /**
     * 
     * @returns Whether it succeeded or not
     */
    public async SubmitChanges(): Promise<ReturnValueInterface> {
        if (this.CheckActivity().error) return this.CheckActivity();
        this.active = false;


    }

    /**
     * 
     * @returns Whether it succeeded or not
     */
    private async ConflictHandler(): Promise<ReturnValueInterface> {
        if (this.CheckActivity().error) return this.CheckActivity();
        const redesigner = new ModelRedesigner();
        if (this.loadedItem.tags != undefined) {
            this.loadedItem.tags = await redesigner.TagsRedesigner(this.loadedItem.tags)
        }
        this.loadedItem.players = await redesigner.PlayerRedesigner(this.loadedItem.players)
        this.loadedItem.games = await redesigner.GameRedesigner(this.loadedItem.games)
        this.loadedItem.locations = await redesigner.LocationRedesigner(this.loadedItem.locations)
        this.loadedItem.challenges = await redesigner.ChallengeRedesigner(this.loadedItem.challenges)
        this.loadedItem.groups = await redesigner.GroupRedesigner(this.loadedItem.groups)
        this.loadedItem.deletedObjects = this.loadedItem.deletedObjects // yes this is dumb, but a temp visualisation for me that i have done everyting
        // this.loadedItem.plays = await redesigner.PlayRedesigner(this.loadedItem.plays)
        // this.loadedItem.userInfo = await redesigner.UserInfoRedesigner(this.loadedItem.userInfo)
        console.log(this.loadedItem)

        return {
            error: false,
            message: "First time handling this data.",
            statusCode: 200,
            data: { continue: false, date: new Date(Date.now()) }
        };
    }
}