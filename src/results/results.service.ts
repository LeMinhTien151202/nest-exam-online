import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Result, ResultModel } from './schemas/result.schema';
import mongoose from 'mongoose';

@Injectable()
export class ResultsService {
  constructor(
      @InjectModel(Result.name) private resultModel: ResultModel
    ) {}
  async create(createResultDto: CreateResultDto, user: IUser) {
    const createdResult = await this.resultModel.create({...createResultDto, createdAt: new Date(), createdBy: {
      _id: user._id,
      email: user.email
    }})
    return createdResult;
  }

  async findAll() {
    return await this.resultModel.find();
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("exam is not exist");
    }
    const result = await this.resultModel.findById(id);
    return result;
  }

  async update(id: string, updateResultDto: UpdateResultDto, user: IUser) {
    if (!mongoose.isValidObjectId(id)) { 
      throw new NotFoundException("exam is not exist");
    }
    const result = await this.resultModel.updateOne({ _id: id }, { ...updateResultDto, updatedAt: new Date(), updatedBy: {
      _id: user._id,
      email: user.email
    }});
    return result;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("exam is not exist");
    }
    await this.resultModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    const deletedResult = await this.resultModel.delete({ _id: id });
    return deletedResult;
  }
}
