import { Module } from '@nestjs/common';
import { VinculoController } from './vinculo.controller';

@Module({
  controllers: [VinculoController]
})
export class VinculoModule {}
