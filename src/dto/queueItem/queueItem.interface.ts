import * as mongodb from "mongodb";
import { QueueItemProgression } from "./queueItemProgression.interface";
import { TagInterface } from "../BG_Stats/tags/tags.interface";
import { GroupInterface } from "../BG_Stats/group/group.interface";
import { PlayerInterface } from "../BG_Stats/player/player.interface";
import { LocationInterface } from "../BG_Stats/location/location.interface";
import { GameInterface } from "../BG_Stats/game/game.interface";
import { PlayInterface } from "../BG_Stats/plays/plays.interface";
import { ChallengeInterface } from "../BG_Stats/challenges/challenges.interface";
import { DeletedObjectInterface } from "../BG_Stats/deletedObjects/deletedObjects.interface";
import { UserInfoInterface } from "../BG_Stats/userInfo/userInfo.interface";

export interface QueueItemInterface {
    _id?: mongodb.ObjectId;
    _userId: mongodb.ObjectId;
    uploadTime?: Date;
    progress: QueueItemProgression;
    tags?: TagInterface[];
    groups?: GroupInterface[];
    players: PlayerInterface[];
    locations: LocationInterface[];
    games: GameInterface[];
    plays: PlayInterface[];
    challenges?: ChallengeInterface[];
    deletedObjects?: DeletedObjectInterface[];
    userInfo?: UserInfoInterface;
}