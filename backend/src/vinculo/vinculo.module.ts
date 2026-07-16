import { Module } from '@nestjs/common';
import { VinculoController } from './vinculo.controller';
import { CriarVinculoUseCase } from './use-cases/criar-vinculo.use-case';
import { VinculoCommand } from './repository/command.repo';
import { VinculoQuery } from './repository/query.repo';
import { ListarVinculoUseCase } from './use-cases/listar-vinculo.use-case';
import { ResponsavelQuery } from '@/responsavel/repository/query.repo';
import { EletronicoQuery } from '@/eletronico/repository/query.repo';

@Module({
  controllers: [VinculoController],
  providers: [
    VinculoCommand,
    VinculoQuery,
    CriarVinculoUseCase,
    ListarVinculoUseCase,
    ResponsavelQuery,
    EletronicoQuery,
  ],
})
export class VinculoModule {}
