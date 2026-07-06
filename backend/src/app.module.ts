import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ResponsavelModule } from './responsavel/responsavel.module';

@Module({
  imports: [PrismaModule, ResponsavelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
