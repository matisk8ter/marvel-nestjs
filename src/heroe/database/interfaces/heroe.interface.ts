import { Document, ObjectId } from "mongoose";

export interface IHeroe extends Document{
    id: number;
    name: string;
    description: string;
    thumbnail: {path: string, extension: string};
    idComics: ObjectId[];
}