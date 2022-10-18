import { PartialType } from "@nestjs/mapped-types";
import { HeroeSqlDTO } from "./heroe.dtosql";

export class UpdateHeroeDto extends PartialType(HeroeSqlDTO){}