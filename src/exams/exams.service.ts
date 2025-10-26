import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Exam, ExamModel } from './schemas/exam.schema';
import mongoose from 'mongoose';

@Injectable()
export class ExamsService {
  constructor(@InjectModel(Exam.name) private examModel: ExamModel){  
  }
  async create(createExamDto: CreateExamDto, user: IUser) {
    const createdExam = await this.examModel.create({...createExamDto, createdBy: {
      _id: user._id,
      email: user.email
    }});
    return createdExam;
  }

  async findAll() {
    return this.examModel.find();
  }

  findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("exam is not exist");
    }
    const exam = this.examModel.findById(id);
    return exam;
  }

  async update(id: string, updateExamDto: UpdateExamDto, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("exam is not exist");
    }
    const updatedExam = await this.examModel.updateOne({ _id: id }, { ...updateExamDto, updatedAt: new Date(), updatedBy: {
      _id: user._id,
      email: user.email
    }});
    return updatedExam;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException("exam is not exist");
    }
    await this.examModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } });
    const deletedExam = await this.examModel.delete({ _id: id });
    return deletedExam;
  }

  async updateLogo(id: string, logoPath: string, user: IUser) {
    const updatedExam = await this.examModel.findByIdAndUpdate(
      id,
      {
        logo: logoPath,
        updatedBy: {
          _id: user._id,
          email: user.email,
        }
      },
      { new: true }
    );

    if (!updatedExam) {
      throw new Error('exam not found');
    }

    return updatedExam;
  }
}
