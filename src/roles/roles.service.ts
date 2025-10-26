import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleModel } from './schemas/role.schema';
import mongoose from 'mongoose';
import { ADMIN_ROLE } from 'src/decorator/customize';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: RoleModel){  
  }
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const createdRole = await this.roleModel.create({...createRoleDto, created_by: {
      _id: user._id,
      email: user.email
    }});
    return createdRole;  
  }

  async findAll() {
    return `This action returns all roles`;
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("permission is not exist");
    }
    const role =  await this.roleModel.findById(id)
    .populate({path: 'permissions', select: {_id: -1, name: 1, apiPath: 1, method: 1}});
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
          throw new NotFoundException("role is not exist");
        }
        const updatedExam = await this.roleModel.updateOne({ _id: id }, { ...updateRoleDto, updatedAt: new Date(), updatedBy: {
          _id: user._id,
          email: user.email
        }});
        return updatedExam;
  }

  async remove(id: string, user: IUser) {
    const foundRole = await this.roleModel.findById(id);
    if(foundRole.name === ADMIN_ROLE) {
      throw new BadRequestException('Role not removeable');
    }
    await this.roleModel.updateOne({ _id: id }, {deletedBy: {_id: user._id, email: user.email}});
    return await this.roleModel.deleteOne({ _id: id });
  }
}
