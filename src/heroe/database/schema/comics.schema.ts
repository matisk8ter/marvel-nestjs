import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { ComicSummary } from './comicSummary.schema';

export type ComicsDocument = Comics & Document;

@Schema({versionKey: false})
export class Comics {

  @Prop()
  id: number;

  @Prop()
  title : string;

  @Prop()
  description : string;

  @Prop()
  issueNumber : number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ComicSummary.name})
  idComicSummary: ObjectId;
}

export const ComicSchema = SchemaFactory.createForClass(Comics);