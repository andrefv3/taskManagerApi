// src/tasks/tasks.service.ts

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';
import { calculatePriorityScore, explainPriority } from './utils/task-math.util';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all tasks for a specific user, ordered by priority score.
   */
  async findAll(userId: string) {
    try {
      return await this.prisma.task.findMany({
        where: { userId },
        orderBy: { priorityScore: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch tasks for user ${userId}`, error instanceof Error ? error.stack : String(error));
      throw new InternalServerErrorException('An unexpected error occurred while retrieving tasks.');
    }
  }

  /**
   * Retrieves a single task ensuring user ownership.
   */
  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return task;
  }

  /**
   * Creates a new task and automatically computes its priority score.
   */
  async create(userId: string, dto: CreateTaskDto) {
    const score = calculatePriorityScore(dto.impact, dto.effort);

    return this.prisma.task.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        priorityScore: score,
        user: { connect: { id: userId } },
      },
    });
  }

  /**
   * Updates a task and recalculates priority score if impact or effort changed.
   */
  async update(id: string, userId: string, dto: UpdateTaskDto) {
    // 1. Check if recalculation is needed
    let newScore: number | undefined;
    
    if (dto.impact !== undefined || dto.effort !== undefined) {
      const currentTask = await this.findOne(id, userId);
      newScore = calculatePriorityScore(
        dto.impact ?? currentTask.impact,
        dto.effort ?? currentTask.effort,
      );
    }

    try {
      return await this.prisma.task.update({
        where: { id, userId },
        data: {
          ...dto,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
          priorityScore: newScore,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Task with ID "${id}" not found.`);
      }
      throw error;
    }
  }

  /**
   * Atomically deletes a task.
   */
  async remove(id: string, userId: string) {
    try {
      await this.prisma.task.delete({
        where: { id, userId },
      });
      return { success: true, message: 'Task deleted successfully.' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Task with ID "${id}" not found.`);
      }
      throw error;
    }
  }

  /**
   * Provides the logic behind the task's priority score.
   */
  async getExplanation(taskId: string, userId: string) {
    const task = await this.findOne(taskId, userId);
    return explainPriority(task.impact, task.effort);
  }
}