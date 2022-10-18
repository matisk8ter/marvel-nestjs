import { ObjectId } from "mongoose";

export class ComicDTO{
    id: number;
    title: string;
    description : string;
    issueNumber : number;
    idComicSummary: ObjectId;
 }