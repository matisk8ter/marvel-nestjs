import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { throws } from 'assert';
import { IHeroe } from '../database/interfaces/heroe.interface';
import { Comics, ComicSchema } from '../database/schema/comics.schema';
import { HeroeMongo } from '../database/schema/heroe.schema';
import { ComicDTO } from '../dto/dtoNoSql/comic.dto';
import { HeroeSqlDTO } from '../dto/dtoSQL/heroe.dtosql';
import { UpdateHeroeDto } from '../dto/dtoSQL/updateHeroe.dtosql';
import { HeroeModule } from '../heroe.module';
import { ComicServiceSQL } from '../services/comic-sql.service';
import { ComicSummarySQLService } from '../services/comicSummary-sql.service';
import { HeroeNoSQLService } from '../services/heroe-nosql.service';
import { HeroeSQLService } from '../services/heroe-sql.service';
import { MarvelHeroesService } from '../services/marvel-heroes.service';

@Controller('heroe')
export class HeroeController {
  constructor(
    private readonly heroeMongoService: HeroeNoSQLService,
    private readonly heroeMySqlService: HeroeSQLService,
    private readonly comicMySqlService: ComicServiceSQL,
    private readonly comicSummaryMySqlService: ComicSummarySQLService,
    private readonly heroeService: MarvelHeroesService,
  ) { }

  @Get('/heroesFetch/:count/:page')
  async getHeroes(
    @Param('count', ParseIntPipe) count: number,
    @Param('page', ParseIntPipe) page: number,
  ): Promise<any> {
    const heroes = await this.heroeService.getHeroesFetch(count, page);
    return heroes
  }
  @Get('comic/:id')
  async getComicSQL(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.heroeService.getComicsSql(id);

  }

  @Get('/allData/:id')
  async getAllData(@Param('id', ParseIntPipe) id: number) {
    const comic = await this.heroeService.getAllData(id)

    return comic
  }

  //------------HEROE CONTROLLER--------------
  @Post('nosql/:id')
  async saveHeroeNoSQL(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const heroe = await this.heroeService.getHeroeByIdFetch(id);
    return this.heroeMongoService.save(heroe.id, heroe)
  }

  @Post('sql/:id')
  async saveHeroeSQL(
    @Param('id') id: number
  ) {
    const hero = await this.heroeService.getHeroeSql(id)
    return this.heroeMySqlService.save(id, hero)
  }

  @Put('sql/:idHeroe')
  async update(
    @Param('idHeroe') idHeroe: string,
    @Query('id') id: number
  ) {
    const newHero = await this.heroeService.getHeroeSql(id);
    const hero = await this.heroeMySqlService.update(idHeroe, newHero);
    if (!hero) throw new NotFoundException('no existe el heroe')

    return {
      message: 'Heroe Updated Succesfully',
      hero
    };
  }

  @Put('update/nosql/:idHeroeMongo')
  async updateHeroeNoSQL(
    @Param('idHeroeMongo') idHeroeMongo: string,
    @Query('id') id: number
  ) {
    const newHeroe = await this.heroeService.getHeroeByIdFetch(id)
    const heroe = await this.heroeMongoService.updateHeroe(idHeroeMongo, newHeroe)
    if (!heroe) throw new NotFoundException('no existe el heroe')

    return {
      message: 'Heroe Updated Succesfully',
      heroe
    };
  }
  @Delete('sql/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.heroeMySqlService.delete(id);
  }

  @Delete('/delete/nosql/:id')
  async deleteHeroeNoSQL(@Param('id') id: string) {
    const hero = await this.heroeMongoService.deleteHeroe(id);
    if (!hero) throw new NotFoundException('no existe el heroe')
    return {
      message: 'Heroe Deleted Succesfully',
      hero
    };
  }

  //------------COMIC CONTROLLER--------------

  @Put('updateComic/nosql/:idComicsMongo')
  async updateComicsNoSQL(
    @Param('idComicsMongo') idComicsMongo: string,
    @Query('id') id: number
  ) {
    const newComicList = await this.heroeService.getComicsByIdFetch(id)
    const comic = await this.heroeMongoService.updateComic(idComicsMongo, newComicList)
    if (!comic) throw new NotFoundException('Comic not found')

    return {
      message: 'Comic Updated Succesfully',
      comic
    };
  }

  @Delete('/deleteComic/nosql/:id')
  async deleteComicsNoSQL(@Param('id') id: string) {
    const comic = await this.heroeMongoService.deleteComic(id);
    if (!comic) throw new NotFoundException('Comic not found')
    return {
      message: 'Comic Deleted Succesfully',
      comic
    };
  }
  @Put('updateComic/sql/:idComicsMongo')
  async updateComicsSQL(
    @Param('idComicSQL') idComicsMongo: string,
    @Query('id') id: number
  ) {
    const newComicList = await this.heroeService.getComicsSql(id)
    const comic = await this.comicMySqlService.updateComic(idComicsMongo, newComicList)
    if (!comic) throw new NotFoundException('Comic not found')

    return {
      message: 'Comic Updated Succesfully',
      comic
    };
  }

  @Delete('/deleteComic/sql/:id')
  async deleteComicsSQL(@Param('id') id: string) {
    const comic = await this.comicMySqlService.deleteComic(id);
    if (!comic) throw new NotFoundException('Comic not found')
    return {
      message: 'Comic Deleted Succesfully',
      comic
    };
  }
  //------------COMIC SUMMARY CONTROLLER--------------

  @Put('updateComicSummary/nosql/:idComicsMongo')
  async updateComicSummaryNoSQL(
    @Param('idComicsMongo') idComicsMongo: string,
    @Query('id') id: number
  ) {
    const newComicSummary = await this.heroeService.getComicsSummaryById(id)
    const comicSummary = await this.heroeMongoService.updateComicSummary(idComicsMongo, newComicSummary)
    if (!comicSummary) throw new NotFoundException('Comic not found')

    return {
      message: 'Comic Updated Succesfully',
      comicSummary
    };
  }

  @Delete('/deleteComic/nosql/:id')
  async deleteComicSummaryNoSQL(@Param('id') id: string) {
    const comicSummary = await this.heroeMongoService.deleteComicSummary(id);
    if (!comicSummary) throw new NotFoundException('Comic not found')
    return {
      message: 'Comic Deleted Succesfully',
      comicSummary
    };
  }
  @Put('updateComicSummary/nosql/:idComicsMongo')
  async updateComicSummarySQL(
    @Param('idComicsMongo') idComicsMongo: string,
    @Query('id') id: number
  ) {
    const newComicSummary = await this.heroeService.getComicSummarySql(id)
    const comicSummary = await this.comicSummaryMySqlService.updateComicSummary(idComicsMongo, newComicSummary)
    if (!comicSummary) throw new NotFoundException('Comic not found')

    return {
      message: 'Comic Updated Succesfully',
      comicSummary
    };
  }

  @Delete('/deleteComic/nosql/:id')
  async deleteComicSummarySQL(@Param('id') id: string) {
    const comicSummary = await this.comicSummaryMySqlService.deleteComicSummary(id);
    if (!comicSummary) throw new NotFoundException('Comic not found')
    return {
      message: 'Comic Deleted Succesfully',
      comicSummary
    };
  }
}
