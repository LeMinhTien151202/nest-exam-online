import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';
import { Question } from 'src/questions/schemas/question.schema';
// export type ExamDocument = HydratedDocument<Exam>;
@Schema({ timestamps: true })
export class Exam {

  @Prop()
  name: string;

  @Prop()
  questionId: Question[];

  @Prop()
  category: string;

  @Prop()
  level: string;

  @Prop()
  picture: string;

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
export type ExamDocument = Exam & Document & SoftDeleteDocument;

// Extend Model với SoftDeleteModel
export type ExamModel = SoftDeleteModel<ExamDocument>;

export const ExamSchema = SchemaFactory.createForClass(Exam);

// Thêm plugin mongoose-delete
ExamSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: 'all',
  indexFields: ['deleted', 'deletedAt']
});
