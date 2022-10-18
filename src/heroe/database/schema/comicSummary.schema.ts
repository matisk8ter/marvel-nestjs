import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ComicSummaryDocument = ComicSummary & Document;

@Schema({versionKey: false})
export class ComicSummary {
   
  @Prop()
  resourceURI: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

}

export const ComicSummarySchema = SchemaFactory.createForClass(ComicSummary);