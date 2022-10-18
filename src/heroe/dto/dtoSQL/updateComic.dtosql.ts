import { PartialType } from "@nestjs/mapped-types";
import { ComicSqlDTO } from "./comic.dtosq";

export class UpdateComicDto extends PartialType(ComicSqlDTO){}