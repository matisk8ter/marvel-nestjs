import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { ComicsSummary } from "src/heroe/database/entityes/comicsummary.entity";

export class ComicSqlDTO{

    @ApiProperty()
    @IsInt()
    @IsPositive()
    idComic: number;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsInt()
    issueNumber: number;

    @ApiProperty()
    comicSummary: ComicsSummary;

   
 }


