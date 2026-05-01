import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsDateString, 
  IsInt, 
  Min, 
  Max, 
  MinLength 
} from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  // --- DECISION ENGINE FIELDS ---
  // We include these so the user can adjust the priority logic

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  impact?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  effort?: number;
}