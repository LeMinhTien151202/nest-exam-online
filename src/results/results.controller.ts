import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { IUser } from 'src/users/users.interface';
import { User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  create(@Body() createResultDto: CreateResultDto, @User() user: IUser) {
    return this.resultsService.create(createResultDto, user);
  }

  @Get()
  findAll() {
    return this.resultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto, @User() user: IUser) {
    return this.resultsService.update(id, updateResultDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resultsService.remove(id, user);
  }
}
