import { ObjectId } from "mongoose";
import { ComicDTO } from "./comic.dto";

export class HeroeDTO{
   id: number;
   name: string;
   description: string;
   thumbnail: {path: string, extension: string};
   idComics: ObjectId[];
}