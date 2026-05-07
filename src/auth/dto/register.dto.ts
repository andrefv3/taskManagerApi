// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  lastName?: string | null;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  profilePicture?: string | null; 

  @IsString()
  provider!: 'LOCAL' | 'GOOGLE';

  @IsString()
  @IsOptional()
  @MinLength(6)
  password!: string | null;

  @IsOptional()
  @IsString()
  avatar?: string | null; 
}