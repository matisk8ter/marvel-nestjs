import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { Comic } from "src/heroe/database/entityes/comic.entity";

export class HeroeSqlDTO{
   
    @ApiProperty()
    @IsInt()
    @IsPositive()
    idHeroe: number;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    thumbnail: string;

    @ApiProperty()
    @IsString()
    extension: string;

    @ApiProperty()
    @IsString()
    @IsArray()
    @IsOptional()
    comics?: Comic[];

 }


