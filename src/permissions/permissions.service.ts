import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionModel } from './schemas/permission.schema';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: PermissionModel){
  }
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const permission = await this.permissionModel.create({...createPermissionDto, 
      createdAt: new Date(),
       createdBy: {_id: user._id, email: user.email}});
    return permission;
  }

  async findAll() {
    return await this.permissionModel.find();
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("permission is not exist");
    }
    const permission = await this.permissionModel.findById(id);
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("permission is not exist");
    }
    const permission = await this.permissionModel.updateOne({ _id: id }, 
      { ...updatePermissionDto, 
        updatedAt: new Date(),
         updatedBy: {_id: user._id, email: user.email} });
    return permission;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("permission is not exist");
    }
    await this.permissionModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    const deletedPermission = await this.permissionModel.delete({ _id: id });
    return deletedPermission;
  }
}
