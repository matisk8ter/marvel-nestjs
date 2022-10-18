import { Document } from "mongoose";

export interface IComicSummary extends Document{
    resourceURI: string;
    title: string;
    description: string;
}