import { Document, ObjectId } from "mongoose";

export interface IComics extends Document{
    id: number;
    title: string;
    description : string;
    issueNumber : number;
    idComicSummary: ObjectId;
}