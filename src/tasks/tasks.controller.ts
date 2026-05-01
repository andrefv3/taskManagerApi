import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'; 
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Tasks Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all tasks for the authenticated user' })
  findAll(@CurrentUser() user: any) {
    return this.tasksService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task with priority intelligence' })
  create(@CurrentUser() user: any, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.id, dto);
  }

  @Get(':id/explain')
  @ApiOperation({ summary: 'Get the qualitative reasoning behind a task priority score' })
  explain(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.getExplanation(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task details and recalculate priority' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permanently remove a task' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.remove(id, user.id);
  }
}