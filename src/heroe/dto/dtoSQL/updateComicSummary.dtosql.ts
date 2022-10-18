import { PartialType } from "@nestjs/mapped-types";
import { ComicSummarySqlDTO } from "./comicsummary.dtosql";

export class UpdateComicSummaryDto extends PartialType(ComicSummarySqlDTO){}