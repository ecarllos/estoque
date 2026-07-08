import { Module } from '@nestjs/common';
import { ResponsavelController } from './responsavel.controller';
import { CriarResponsavelUseCase } from './use-cases/criar-responsavel.use-case';
import { ResponsavelQuery } from './repository/query.repo';
import { ResponsavelCommand } from './repository/command.repo';
import { MostrarUmResponsavel } from './use-cases/mostrar-um-responsavel.use-case';

@Module({
  controllers: [ResponsavelController],
  providers: [
    ResponsavelQuery,
    ResponsavelCommand,
    CriarResponsavelUseCase,
    MostrarUmResponsavel,
  ],
})
export class ResponsavelModule {}
