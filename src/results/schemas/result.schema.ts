import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';
import { Question } from 'src/questions/schemas/question.schema';
// export type ResultDocument = HydratedDocument<Result>;
@Schema({ timestamps: true })
export class Result {

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  examId: mongoose.Schema.Types.ObjectId;

  @Prop()
  score: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({type: Object})
  createdBy:{
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };
  
  @Prop({type: Object})
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };

  @Prop({type: Object})
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };

  @Prop()
  deletedAt: Date;
}
// Extend Document với SoftDeleteDocument
export type ResultDocument = Result & Document & SoftDeleteDocument;

// Extend Model với SoftDeleteModel
export type ResultModel = SoftDeleteModel<ResultDocument>;

export const ResultSchema = SchemaFactory.createForClass(Result);

// Thêm plugin mongoose-delete
ResultSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: 'all',
  indexFields: ['deleted', 'deletedAt']
});
