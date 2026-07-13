import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ResponsavelModule } from './responsavel/responsavel.module';
import { EletronicoModule } from './eletronico/eletronico.module';
import { VinculoModule } from './vinculo/vinculo.module';

@Module({
  imports: [PrismaModule, ResponsavelModule, EletronicoModule, VinculoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
