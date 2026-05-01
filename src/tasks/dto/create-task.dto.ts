import { IsString, IsOptional, IsEnum, IsDateString, MinLength, IsInt, Min, Max } from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  title!: string;
  
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  impact: number = 1; // Por defecto 1 (Bajo impacto)

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  effort: number = 1; // Por defecto 1 (Bajo esfuerzo)
}
