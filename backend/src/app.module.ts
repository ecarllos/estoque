import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ResponsavelModule } from './responsavel/responsavel.module';

@Module({
  imports: [PrismaModule, ResponsavelModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
