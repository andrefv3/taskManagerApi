import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import axios from 'axios';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ConflictException('Email already in use');

    // 1. Generate OTP and Expiration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10);

    if (!dto.password) {
      throw new BadRequestException('Password is required');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    // 2. Create user BUT with isVerified: false
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        lastName: dto.lastName,
        email: dto.email,
        password: hashed,
        verificationCode: otp,
        codeExpires: expires,
        isVerified: false,
      },
    });

    // 3. Send email (Don't block the flow, but fire and forget)
    await this.mailService.sendOTP(user.email, otp);

    return {
      status: 'PENDING_VERIFICATION',
      message: 'Please check your email for the verification code',
      email: user.email
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // 1. If the user doesn't exist, we throw an error
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. PROTECCIÓN OAUTH: If the password is null, it means it's a Google account
    // We don't try to compare passwords, we simply reject the login.
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Now that we're sure there's a password, we compare
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const { password, ...result } = user;
    return this.signToken(user.id, user.email, result);
  }

  // auth.service.ts

  async googleAuth(googleToken: string) {
    try {
      // 1. Validar con Google
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${googleToken}` },
      });

      const { email, given_name, family_name, picture, sub: googleId } = data;

      // 2. Intentar encontrar al usuario
      let user = await this.prisma.user.findUnique({ where: { email } });
      let isNewUser = false;

      if (user) {
        // LOGIN: Usuario ya existe, vinculamos googleId si no lo tiene
        user = await this.prisma.user.update({
          where: { email },
          data: { 
            googleId, 
            profilePicture: user.profilePicture || picture 
          },
        });
      } else {
        // REGISTRO: Creamos el usuario por primera vez
        isNewUser = true;
        user = await this.prisma.user.create({
          data: {
            email,
            name: given_name,
            lastName: family_name || '',
            profilePicture: picture,
            googleId,
            provider: 'GOOGLE',
            isVerified: true, // Google ya lo verificó
          },
        });
      }

      // 4. Generate Session 
      return this.generateSession(user);
    } catch (error) {
      throw new UnauthorizedException('Google Authentication Failed');
    }
  }

  private async generateSession(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      name: user.name 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      },
    };
  }

  private signToken(userId: string, email: string, user: object) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwt.sign(payload),
      user,
    };
  }
}