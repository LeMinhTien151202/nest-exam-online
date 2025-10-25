import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';
// export type QuestionDocument = HydratedDocument<Question>;
@Schema({ timestamps: true })
export class Question {

  @Prop()
  content: string;

  @Prop()
  answerA: string;

  @Prop()
  answerB: string;

  @Prop()
  answerC: string;

  @Prop()
  answerD: string;

  @Prop()
  answerCorrect: string;

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
export type QuestionDocument = Question & Document & SoftDeleteDocument;

// Extend Model với SoftDeleteModel
export type QuestionModel = SoftDeleteModel<QuestionDocument>;

export const QuestionSchema = SchemaFactory.createForClass(Question);

// Thêm plugin mongoose-delete
QuestionSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: 'all',
  indexFields: ['deleted', 'deletedAt']
});
