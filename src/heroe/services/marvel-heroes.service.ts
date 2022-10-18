import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import fetch from 'node-fetch'
import { createHash } from 'crypto';
import { HeroeMongo } from '../database/schema/heroe.schema';
import { IHeroe } from '../database/interfaces/heroe.interface';
import { HeroeDTO } from '../dto/dtoNoSql/heroe.dto';
import { IComics } from '../database/interfaces/comics.interface';
import { ComicDTO } from '../dto/dtoNoSql/comic.dto';
import { ComicSummaryDTO } from '../dto/dtoNoSql/comicsummary.dto';
import { HeroeNoSQLService } from './heroe-nosql.service';
import { IComicSummary } from '../database/interfaces/comicsummary.interface';
import { HeroeSqlDTO } from '../dto/dtoSQL/heroe.dtosql';
import { ComicSqlDTO } from '../dto/dtoSQL/comic.dtosq';
import { ComicServiceSQL } from './comic-sql.service';
import { ComicSummarySQLService } from './comicSummary-sql.service';
import { ComicSummarySqlDTO } from '../dto/dtoSQL/comicsummary.dtosql';
import { Comic } from '../database/entityes/comic.entity';
import c from 'config';



@Injectable()
export class MarvelHeroesService {
    constructor(
        @InjectModel(HeroeMongo.name) private readonly heroeModel: Model<IHeroe>,
        private readonly noSqlService: HeroeNoSQLService,
        private readonly sqlComicService: ComicServiceSQL,
        private readonly sqlComicSummaryService: ComicSummarySQLService,
    ) { }

    //-----------------NO SQL SERVICE --------------------

    // populate
    async getAllData(idHero: number) {
        const allData = await this.heroeModel.findOne({id: idHero}).populate({ path: 'idComics', populate: { path: 'idComicSummary'}})
        return allData;
    }
    // obtenemos todos los  heroes del api
    async getHeroesFetch(count: number, page: number): Promise<any> {
        const md5 = createHash('md5').update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).digest("hex")
        const result = await fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=${process.env.TS}&limit=${count}&offset=${page}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`)
            .then(res => res.json())
        return result
    }
    // obtengo heroes por id 
    async getHeroeByIdFetch(heroeId: number): Promise<HeroeDTO> {
        const md5 = createHash('md5').update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).digest("hex")
        const result = await fetch(
            `https://gateway.marvel.com:443/v1/public/characters/${heroeId}?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`,
        );
        const res = await result.json();
        const heroe = new HeroeDTO()
        heroe.id = res.data.results[0].id;
        heroe.name = res.data.results[0].name;
        heroe.description = res.data.results[0].description;
        heroe.thumbnail = res.data.results[0].thumbnail
        heroe.idComics = await this.saveComicAndReturnIdList(heroeId)

        return heroe;
    }
    // obtengo los comics por id del heroe
    async getComicsByIdFetch(heroeId: number): Promise<IComics[]> {
        const md5 = createHash('md5').update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).digest("hex")

        const result = await fetch(
            `https://gateway.marvel.com:443/v1/public/characters/${heroeId}/comics?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`,
        ).then((res) => res.json())
            .then((comics) => {
                const result = comics.data.results
                    .map(async comic => {
                        const comicDto = new ComicDTO();
                        comicDto.id = comic.id;
                        comicDto.title = comic.title;
                        comicDto.description = comic.description;
                        comicDto.issueNumber = comic.issueNumber;
                        comicDto.idComicSummary = await (await this.getComicsSummaryById(comic.id))._id
                    });

                return Promise.all(result);
            });
        return result;
    }
    // obtengo comics y devuelvo una lista de idComics
    async saveComicAndReturnIdList(personajeId: number): Promise<ObjectId[]> {
        const md5 = createHash('md5').update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).digest("hex")
        const result = await fetch(
            `https://gateway.marvel.com:443/v1/public/characters/${personajeId}/comics?ts=${process.env.ts}&apikey=${process.env.public_key}&hash=${md5}`,
        )
            .then((res) => res.json())
            .then((comics) => {
                const result = comics.data.results
                    .map(async comic => {
                        const comicDto = new ComicDTO();
                        comicDto.id = comic.id;
                        comicDto.title = comic.title;
                        comicDto.description = comic.description;
                        comicDto.issueNumber = comic.issueNumber;
                        comicDto.idComicSummary = await this.getComicsSummaryByIdFetch(comic.id)
                        return comicDto
                    });

                return Promise.all(result);
            });
        const comics = await this.noSqlService.saveComics(result);
        return comics.map(comic => comic._id);
    }
    //obtengo comicsummary y devuelvo el idComicSummary
    async getComicsSummaryByIdFetch(comicId: number): Promise<ObjectId> {
        const md5 = createHash('md5').update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).digest("hex")

        const result = await fetch(
            `https://gateway.marvel.com:443/v1/public/comics/${comicId}?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`)
            .then(res => res.json())
            .then(comic => {
                const comics = comic.data.results[0]
                const comicSummaryDto = new ComicSummaryDTO();
                comicSummaryDto.title = comics.title;
                comicSummaryDto.description = comics.description;
                comicSummaryDto.resourceURI = comics.resourceURI;
                return this.noSqlService.saveComicSummary(comicSummaryDto, comics.id)
            });
        return result._id;
    }
    // obtengo comicsummary por id del comic
    async getComicsSummaryById(comicId: number): Promise<IComicSummary> {
        const md5 = createHash('md5').update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).digest("hex")

        const result = await fetch(
            `https://gateway.marvel.com:443/v1/public/comics/${comicId}?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`)
            .then(res => res.json())
            .then(comic => {
                const comics = comic.data.results[0]
                const comicSummaryDto = new ComicSummaryDTO();
                comicSummaryDto.title = comics.title;
                comicSummaryDto.description = comics.description;
                comicSummaryDto.resourceURI = comics.resourceURI;
            });
        return result;
    }


    //----------------- SQL SERVICE --------------------

    // obtengo heroes por id 
    async getHeroeSql(heroeId: number): Promise<HeroeSqlDTO> {
        const md5 = createHash('md5').update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).digest("hex")
        const result = await fetch(
            `https://gateway.marvel.com:443/v1/public/characters/${heroeId}?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`,
        );
        const res = await result.json();
        const hero = res.data.results[0]
        const heroe = new HeroeSqlDTO()
        heroe.idHeroe = hero.id;
        heroe.name = hero.name;
        heroe.description = hero.description;
        heroe.thumbnail = hero.thumbnail.path;
        heroe.extension = hero.thumbnail.extension;
        heroe.comics = await this.getComicsSql(heroeId)
        return heroe;
    }
    // obtengo los comics por id del heroe
    async getComicsSql(heroeId: number) {
        const md5 = createHash('md5').update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).digest("hex")
        const result = await fetch(
            `https://gateway.marvel.com:443/v1/public/characters/${heroeId}/comics?ts=${process.env.ts}&apikey=${process.env.public_key}&hash=${md5}`,
        )
            .then((res) => res.json())
            .then((comics) => {
                const result = comics.data.results
                    .map(async comic => {
                        const comicDto = new ComicSqlDTO();
                        comicDto.idComic = comic.id;
                        comicDto.title = comic.title;
                        comicDto.issueNumber = comic.issueNumber;
                        comicDto.comicSummary = await this.getComicSummarySql(comic.id)
                        return comicDto
                    });
                return Promise.all(result);
            });
          
        const comics = await this.sqlComicService.saveComic(result);
        return comics
    }
     //obtengo comicsummary y devuelvo el idComicSummary
     async getComicSummarySql(comicId: number){
        const md5 = createHash('md5').update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).digest("hex")

        const result = await fetch(
            `https://gateway.marvel.com:443/v1/public/comics/${comicId}?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`)
            .then(res => res.json())
            .then(comic => {
                const comicDto = comic.data.results[0]
                const comicSummaryDto = new ComicSummarySqlDTO();
                comicSummaryDto.description = comicDto.description;
                comicSummaryDto.resourceURI = comicDto.resourceURI;
                return this.sqlComicSummaryService.saveComicSummary(comicDto.id, comicSummaryDto)
            });    
        return result;
    }

}
