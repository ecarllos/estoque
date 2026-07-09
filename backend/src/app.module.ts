import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ResponsavelModule } from './responsavel/responsavel.module';
import { EletronicoModule } from './eletronico/eletronico.module';

@Module({
  imports: [PrismaModule, ResponsavelModule, EletronicoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
