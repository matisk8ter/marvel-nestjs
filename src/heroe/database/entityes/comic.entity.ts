import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { ComicsSummary } from './comicsummary.entity';
import { Heroe } from './heroe.entity';

@Entity()
export class Comic {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('float')
    idComic: number;

    @Column('text')
    title: string;

    @Column('float')
    issueNumber: number;

    @ManyToMany(() => Heroe, (heroe) => heroe.comics)
    heroes: Heroe[]


    @OneToOne(() => ComicsSummary, (comicSummary) => comicSummary.comic)
    @JoinColumn()
    comicSummary: ComicsSummary;


}