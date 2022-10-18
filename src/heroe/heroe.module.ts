// Libraries
import { Module } from '@nestjs/common';

// Controllers
import { HeroeController } from './controllers/heroe.controller';

// Services
import { HeroeSQLService } from './services/heroe-sql.service';
import { HeroeNoSQLService } from './services/heroe-nosql.service';
import { MarvelHeroesService } from './services/marvel-heroes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroeMongo, HeroeSchema } from './database/schema/heroe.schema';
import { Comics, ComicSchema } from './database/schema/comics.schema';
import { ComicSummary, ComicSummarySchema } from './database/schema/comicSummary.schema';
import { Heroe } from './database/entityes/heroe.entity';
import { Comic } from './database/entityes/comic.entity';
import { ComicsSummary } from './database/entityes/comicsummary.entity';
import { ComicServiceSQL } from './services/comic-sql.service';
import { ComicSummarySQLService } from './services/comicSummary-sql.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Heroe,Comic,ComicsSummary]),
    MongooseModule.forFeature([
      {name: HeroeMongo.name, schema: HeroeSchema},
      {name: Comics.name, schema: ComicSchema},
      {name: ComicSummary.name, schema: ComicSummarySchema},
    ])
  ],
  controllers: [HeroeController],
  providers: [MarvelHeroesService, HeroeSQLService, HeroeNoSQLService, ComicServiceSQL, ComicSummarySQLService],
})
export class HeroeModule {}
