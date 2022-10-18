import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Comic } from './comic.entity';

@Entity()
export class ComicsSummary {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    resourceURI:string;

    @Column('text', { nullable: true })
    description: string;

    @OneToOne(() => Comic, (comic) => comic.comicSummary)
    comic: Comic

}