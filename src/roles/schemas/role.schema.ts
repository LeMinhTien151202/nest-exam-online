import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';
import { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';
import { Permission } from 'src/permissions/schemas/permission.schema';

// export type RoleDocument = HydratedDocument<Role>;
//bật time stamp câp nhật createdAt, updatedAt
@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

//   @Prop({type: [mongoose.Schema.Types.ObjectId], ref: Permission.name})
//   permissions: Permission[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };
  
  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

}
// Extend Document với SoftDeleteDocument
export type RoleDocument = Role & Document & SoftDeleteDocument;

// Extend Model với SoftDeleteModel
export type RoleModel = SoftDeleteModel<RoleDocument>;

export const RoleSchema = SchemaFactory.createForClass(Role);

// Thêm plugin mongoose-delete
RoleSchema.plugin(MongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: 'all',
  indexFields: ['deleted', 'deletedAt']
});


