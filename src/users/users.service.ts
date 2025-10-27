import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument, UserModel } from './schemas/user.schema';
import mongoose from 'mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { USER_ROLE } from 'src/decorator/customize';
import { Role, RoleModel } from 'src/roles/schemas/role.schema';
@Injectable()
export class UsersService {

   constructor(
    @InjectModel(UserM.name) private userModel: UserModel,
    @InjectModel(Role.name) private roleModel: RoleModel
  ) {}

  async findOneByUsername(username: string) {
    
    const user = await this.userModel.findOne({ email: username }).populate({path: 'role', select: {name: 1}});
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
    const {name, email, password, age, gender, address, role} = createUserDto
    const IsEmail = await this.userModel.findOne({email: createUserDto.email});
    if (IsEmail) {
      throw new BadRequestException(`Email ${createUserDto.email} đã tồn tại`);
    }

    //fetch user role
    const userRole = await this.roleModel.findOne({name: USER_ROLE});

    const hashedPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({name, email, password : hashedPassword,
       age,
        gender,
         address,
         role: userRole._id,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
  });
    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: any) {
  const { filter, sort, population } = aqp(qs);
  delete filter.current;
  delete filter.pageSize;

  const offset = (currentPage - 1) * limit;
  const totalItems = await this.userModel.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const result = await this.userModel.find(filter)
    .skip(offset)
    .limit(limit)
    .sort(sort as any)
    .populate(population)
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
    if(!mongoose.isValidObjectId(id)) {
      return "user không tồn tại";
    }
    const user = await this.userModel.findOne({ _id: id }).select("-password")
    .populate({path: 'role', select: {_id: -1, name: 1}});
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
     if(!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("user không tồn tại");
    }
    const newUser = await this.userModel.updateOne({ _id: id }, { ...updateUserDto,
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

  updateUserToken = async (_id: string, refreshToken: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  }

    async register(user : RegisterUserDto){
    const hashedPassword = this.getHashPassword(user.password);
    user.password = hashedPassword;
    const newUser = await this.userModel.create({...user});
    return newUser;
  }
}
