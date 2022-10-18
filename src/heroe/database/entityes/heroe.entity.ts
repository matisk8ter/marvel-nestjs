import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Comic } from './comic.entity';

@Entity()
export class Heroe {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('float', {
        unique: true
    })
    idHeroe: number;

    @Column('text')
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    thumbnail: string;

    @Column('text')
    extension: string;

    @ManyToMany(() => Comic, (comic) => comic.heroes)
    @JoinTable()
    comics: Comic[]
}