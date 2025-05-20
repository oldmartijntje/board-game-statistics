import { Schema } from "mongoose";
// imma just ignore these xD
export interface GroupInterface {
    uuid: string;
    id: number;
    name: string;
    type: string;
    isInternal: boolean;
    isDefault: boolean;
    modificationDate: string;
    metaData?: string;
}

export const groupSchema = new Schema<GroupInterface>({
    uuid: { type: String, required: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    isInternal: { type: Boolean, required: true },
    isDefault: { type: Boolean, required: true },
    modificationDate: { type: String, required: true },
    metaData: { type: String }
});
