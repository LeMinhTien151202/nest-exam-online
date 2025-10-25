import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';
// export type PermissionDocument = HydratedDocument<Permission>;
@Schema({ timestamps: true })
export class Permission {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  apiPath: string;

  @Prop()
  method: string;

  @Prop()
  module: string;

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
export type PermissionDocument = Permission & Document & SoftDeleteDocument;

// Extend Model với SoftDeleteModel
export type PermissionModel = SoftDeleteModel<PermissionDocument>;

export const PermissionSchema = SchemaFactory.createForClass(Permission);

// Thêm plugin mongoose-delete
PermissionSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: 'all',
  indexFields: ['deleted', 'deletedAt']
});