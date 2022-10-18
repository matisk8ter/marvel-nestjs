import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Heroe } from '../database/entityes/heroe.entity';
import { HeroeSqlDTO } from '../dto/dtoSQL/heroe.dtosql';
import { validate as isUUID } from 'uuid';
import { UpdateHeroeDto } from '../dto/dtoSQL/updateHeroe.dtosql';

@Injectable()
export class HeroeSQLService {

  private logger = new Logger('HeroeSQLService')

  constructor(
    @InjectRepository(Heroe)
    private readonly heroeRepository: Repository<Heroe>
  ) { }


  //----------         HEROE
  async save(heroeID: number, createHeroeDto: HeroeSqlDTO) {
    let existeEnDB: Heroe;
    existeEnDB = await this.heroeRepository.findOneBy({ idHeroe: heroeID })
    if (existeEnDB) {
      throw new BadRequestException(`Heroe with idHeroe ${heroeID} exists in DB`)
    }
    if (!existeEnDB) {
      return await this.heroeRepository.save(createHeroeDto);
    }
  }

  async findHeroeBy(uuid: string) {
    let heroe: Heroe;

    if (isUUID(uuid)) {
      heroe = await this.heroeRepository.findOneBy({ id: uuid })
    }
    if (!heroe) {
      throw new NotFoundException(`Heroe with ${uuid} not found`)
    }
    return heroe
  }

  async update(id: string, updateHeroeDto: UpdateHeroeDto) {
    
    const heroe = await this.heroeRepository.preload({
      id: id,
      ...updateHeroeDto
    })

    if (!heroe) throw new NotFoundException(`Heroe with ${id} not found`)

    try {

      await this.heroeRepository.save(heroe)
      return heroe

    } catch (error) {

    }
  }

  async delete(uuid: string) {
    const heroe = await this.findHeroeBy(uuid)
    if (heroe) {
      await this.heroeRepository.remove(heroe)
      return `Successfully deleted `
    }
  }


  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)

    throw new InternalServerErrorException("unexpected error, check server logs")
  }
}
