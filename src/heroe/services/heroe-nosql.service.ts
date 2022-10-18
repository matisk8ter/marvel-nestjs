import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IComics } from '../database/interfaces/comics.interface';
import { IComicSummary } from '../database/interfaces/comicsummary.interface';
import { IHeroe } from '../database/interfaces/heroe.interface';
import { Comics } from '../database/schema/comics.schema';
import { ComicSummary } from '../database/schema/comicSummary.schema';
import { HeroeMongo } from '../database/schema/heroe.schema';
import { ComicDTO } from '../dto/dtoNoSql/comic.dto';
import { ComicSummaryDTO } from '../dto/dtoNoSql/comicsummary.dto';
import { HeroeDTO } from '../dto/dtoNoSql/heroe.dto';

@Injectable()
export class HeroeNoSQLService {
  constructor(
    @InjectModel(HeroeMongo.name) private readonly heroeModel: Model<IHeroe>,
    @InjectModel(Comics.name) private readonly comicModel: Model<IComics>,
    @InjectModel(ComicSummary.name) private readonly comicSummaryModel: Model<IComicSummary>,

  ) { }
  // HEROES
  async save(heroeId: number, createHeroeDto: HeroeDTO): Promise<IHeroe> {
    let existeEnDB: HeroeDTO;

    if (!isNaN(+heroeId)) {
      existeEnDB = await this.heroeModel.findOne({ id: heroeId })
    }
    if (existeEnDB) {
      throw new BadRequestException(`Heroe with id "${heroeId}" Exist in db`)
    }

    if (!existeEnDB) {
      const heroe = await this.heroeModel.create(createHeroeDto);
      return heroe.save()
    }
  }

  async deleteHeroe(heroeID: string): Promise<IHeroe> {
    const heroeDelete = await this.heroeModel.findByIdAndDelete(heroeID);
    return heroeDelete;
  }
  async updateHeroe(heroeID: string, createHeroeDto: HeroeDTO): Promise<IHeroe> {
    const updateHeroe = await this.heroeModel.findByIdAndUpdate(heroeID, createHeroeDto, { new: true });
    return updateHeroe;
  }


  // COMICS
  async saveComics(comicsDtos: ComicDTO[]): Promise<IComics[]> {
    const comicsRetorno = comicsDtos.map(async (comicDTO) => {
      const comicExiste = await this.comicModel.findOne({ id: comicDTO.id });
      if (!comicExiste) {
        const comic = new this.comicModel(comicDTO);
        return await comic.save();
      } else {
        return comicExiste;
      }
    });
    return Promise.all(comicsRetorno);
  }

  async deleteComic(heroeID: string): Promise<IComics> {
    const comicDelete = await this.comicModel.findByIdAndDelete(heroeID);
    return comicDelete;
  }
  async updateComic(heroeID: string, createComicDto: ComicDTO[]): Promise<IComics> {
    const updatecomic = await this.comicModel.findByIdAndUpdate(heroeID, createComicDto, { new: true });
    return updatecomic;
  }


  // COMIC SUMMARY
  async saveComicSummary(comicSummaryDTO: ComicSummaryDTO, comicId: number): Promise<IComicSummary> {
    const comicExiste = await this.comicModel.findOne({ id: comicId });
    if (!comicExiste) {
      const comicSummary = new this.comicSummaryModel(comicSummaryDTO);
      return await comicSummary.save();
    }else{
      const comic = await this.comicModel.findOne({ id: comicId }, 'title, description, resourceURI, _id').populate('idComicSummary');
      return new this.comicSummaryModel(comic);
    }
  }

  async deleteComicSummary(heroeID: string): Promise<IComicSummary> {
    const comicDelete = await this.comicSummaryModel.findByIdAndDelete(heroeID);
    return comicDelete;
  }
  async updateComicSummary(heroeID: string, createComicSummaryDto: ComicSummaryDTO): Promise<IComicSummary> {
    const updatecomic = await this.comicSummaryModel.findByIdAndUpdate(heroeID, createComicSummaryDto, { new: true });
    return updatecomic;
  }


}
