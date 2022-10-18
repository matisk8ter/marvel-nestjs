
import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Comics } from './comics.schema';

export type HeroeDocument = HeroeMongo & Document;

@Schema({versionKey: false})
export class HeroeMongo {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({type:{}})
  thumbnail: {path: string, extension: string};

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Comics.name}])
  idComics: ObjectId;
}

export const HeroeSchema = SchemaFactory.createForClass(HeroeMongo);


