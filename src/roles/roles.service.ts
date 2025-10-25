import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleModel } from './schemas/role.schema';

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
    return `This action returns a #${id} role`;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    return `This action updates a #${id} role`;
  }

  async remove(id: string, user: IUser) {
    return `This action removes a #${id} role`;
  }
}
