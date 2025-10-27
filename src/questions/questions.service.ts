import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionModel } from './schemas/question.schema';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class QuestionsService {
  constructor(@InjectModel(Question.name) private questionModel: QuestionModel){
  }
  async create(createQuestionDto: CreateQuestionDto, user: IUser) {
    const question = await this.questionModel.create({...createQuestionDto, createdBy: {
      _id: user._id,
      email: user.email
    }});
    return question;
  }

  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

  const offset = (currentPage - 1) * limit;
  const totalItems = await this.questionModel.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const result = await this.questionModel.find(filter)
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
    if(!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("question không tồn tại");
    }
    const question = await this.questionModel.findById(id);
    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto, user: IUser) {
    const question = await this.questionModel.updateOne({ _id: id }, 
      { ...updateQuestionDto, updatedAt: new Date(), 
        updatedBy: {_id: user._id, email: user.email}});
    return question;
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("question không tồn tại");
    }
    const question = await this.questionModel.delete({ _id: id, createdBy: {_id: user._id, email: user.email} });
    return question;
  }
}
