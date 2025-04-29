import * as mongodb from "mongodb";
import { TagReferenceInterface } from "../tags/tagReference.interface";

export interface PlayerInterface {
    _id?: mongodb.ObjectId;
    uuid: string;
    id: number;
    name: string;
    isAnonymous: boolean;
    modificationDate: string;
    bggUsername?: string;
    metaData: any;
    tags?: TagReferenceInterface[];
}