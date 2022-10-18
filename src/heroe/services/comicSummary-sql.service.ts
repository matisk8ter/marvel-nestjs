import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { Comic } from "../database/entityes/comic.entity";
import { ComicsSummary } from "../database/entityes/comicsummary.entity";
import { ComicSummarySqlDTO } from "../dto/dtoSQL/comicsummary.dtosql";
import { UpdateComicSummaryDto } from "../dto/dtoSQL/updateComicSummary.dtosql";

@Injectable()
export class ComicSummarySQLService {

    private logger = new Logger('ComicSummarySQLService')

    constructor(
        @InjectRepository(ComicsSummary)
        private readonly comicSummaryRepository: Repository<ComicsSummary>,

        @InjectRepository(Comic)
        private readonly comicRepository: Repository<Comic>,

    ) { }

    // COMIC SUMMARY
    async saveComicSummary(comicId: number, createComicSummaryDto: ComicSummarySqlDTO) {
        const existeComic = await this.comicRepository.findOneBy({ idComic: comicId })

        if (!existeComic) {
            return await this.comicSummaryRepository.save(createComicSummaryDto);
        } else {
            return await this.comicSummaryRepository
                .createQueryBuilder("ComicSummaryData")
                .leftJoinAndSelect("ComicSummaryData.comic", "comic")
                .where("comic.idComic = :id", { id: comicId })
                .getOne()
        }
    }

    async findComicSummaryBy(uuid: string) {
        let comicSummary: ComicsSummary;

        if (isUUID(uuid)) {
            comicSummary = await this.comicSummaryRepository.findOneBy({ id: uuid })
        }
        if (!comicSummary) {
            throw new NotFoundException(`Comic with ${uuid} not found`)
        }
        return comicSummary
    }

    async deleteComicSummary(uuid: string) {
        const comicSummary = await this.findComicSummaryBy(uuid)
        return await this.comicSummaryRepository.remove(comicSummary)
    }

    async updateComicSummary(id: string, updateComicSummary: UpdateComicSummaryDto) {
        const comicSummary = await this.comicSummaryRepository.preload({
            id: id,
            ...updateComicSummary
        })

        if (!comicSummary) throw new NotFoundException(`ComicSummary with ${id} not found`)

        try {

            await this.comicSummaryRepository.save(comicSummary)
            return comicSummary

        } catch (error) {
            this.handleDBExceptions(error)
        }
    }
    private handleDBExceptions(error: any) {
        if (error.code === '23505')
            throw new BadRequestException(error.detail)

        this.logger.error(error)

        throw new InternalServerErrorException("unexpected error, check server logs")
    }

}