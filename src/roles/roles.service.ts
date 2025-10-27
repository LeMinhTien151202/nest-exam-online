import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleModel } from './schemas/role.schema';
import mongoose from 'mongoose';
import { ADMIN_ROLE } from 'src/decorator/customize';
import aqp from 'api-query-params';

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

  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

  const offset = (currentPage - 1) * limit;
  const totalItems = await this.roleModel.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const result = await this.roleModel.find(filter)
    .skip(offset)
    .limit(limit)
    .sort(sort as any)
    .populate(population)
    .select(projection as any)
    .exec();

  return {
    meta: {
      current: currentPage,
      pageSize: limit,
      pages: totalPages,
      total: totalItems,
    },
    result,
  };
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
