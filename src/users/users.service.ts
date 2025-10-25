import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument, UserModel } from './schemas/user.schema';
import mongoose from 'mongoose';
import { IUser } from './users.interface';
@Injectable()
export class UsersService {

   constructor(
    @InjectModel(UserM.name) private userModel: UserModel
  ) {}

  async findOneByUsername(username: string) {
    
    let user = await this.userModel.findOne({ email: username });
    return user;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const hash = this.getHashPassword(createUserDto.password);
    createUserDto.password = hash;
    const newUser = await this.userModel.create({ ...createUserDto,
       createdBy: {
        _id: user._id,
        email: user.email,
      }, });
    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    let user = await this.userModel.findOne({ _id: id }).select("-password")
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
     if(!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("user không tồn tại");
    }
    let newUser = await this.userModel.updateOne({ _id: id }, { ...updateUserDto,
     updatedAt: new Date(),
     updatedBy: {
      _id: user._id,
      email: user.email,
     }});
    return newUser;
  }

  async remove(id: string) {
    if(!mongoose.isValidObjectId(id)) {
      return "user không tồn tại";
    }
    const deleteUser = await this.userModel.delete({ _id: id });
    return 'xóa thành công';
  }
}
