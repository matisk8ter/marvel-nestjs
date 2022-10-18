import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ComicSummarySqlDTO {

    @ApiProperty()
    @IsString()
    resourceURI: string;

    @ApiProperty()
    @IsString()
    description: string;

}


