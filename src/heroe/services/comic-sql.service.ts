import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { Comic } from "../database/entityes/comic.entity";
import { ComicSqlDTO } from "../dto/dtoSQL/comic.dtosq";
import { UpdateComicDto } from "../dto/dtoSQL/updateComic.dtosql";


@Injectable()
export class ComicServiceSQL {

    private logger = new Logger('ComicServiceSQL')

    constructor(
        @InjectRepository(Comic)
        private readonly comicRepository: Repository<Comic>,) { }


    // COMICS
    async saveComic(comicDto: ComicSqlDTO[]) {
        const comicsRetorno = comicDto.map(async (comicDTO) => {
            const comicExiste = await this.comicRepository.findOneBy({ idComic: comicDTO.idComic });            
            if (!comicExiste) {
                return await this.comicRepository.save(comicDTO);
            } else {
                return comicExiste;
            }
        });
        return Promise.all(comicsRetorno);
    }

    async findComicBy(uuid: string) {
        let comic: Comic;

        if (isUUID(uuid)) {
            comic = await this.comicRepository.findOneBy({ id: uuid })
        }
        if (!comic) {
            throw new NotFoundException(`Comic with ${uuid} not found`)
        }
        return comic
    }

    async deleteComic(uuid: string) {
        const comic = await this.findComicBy(uuid)
        return await this.comicRepository.remove(comic)
    }


    async updateComic(id: string, updateComicDto: UpdateComicDto[]) {
        const comic = await this.comicRepository.preload({
            id: id,
            ...updateComicDto
        })

        if (!comic) throw new NotFoundException(`Heroe with ${id} not found`)

        try {

            await this.comicRepository.save(comic)
            return comic

        } catch (error) {
            console.log(error)
        }
    }
    private handleDBExceptions(error: any) {
        if (error.code === '23505')
            throw new BadRequestException(error.detail)

        this.logger.error(error)

        throw new InternalServerErrorException("Error inesperado, revisar el log de la consola")
    }

}



