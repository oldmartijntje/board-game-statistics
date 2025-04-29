import * as mongodb from "mongodb";

export interface TagReferenceInterface {
    _id?: mongodb.ObjectId;
    _tagRefId?: mongodb.ObjectId;
    tagRefId: number;
    metaData: any;
}