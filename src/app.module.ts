import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [PrismaModule, AuthModule, MailModule, TasksModule],
})
export class AppModule {}
