import { Module } from '@nestjs/common';
import { ResponsavelController } from './responsavel.controller';
import { CriarResponsavelUseCase } from './use-cases/criar-responsavel.use-case';
import { ResponsavelQuery } from './repository/query.repo';
import { ResponsavelCommand } from './repository/command.repo';
import { MostrarUmResponsavel } from './use-cases/mostrar-um-responsavel.use-case';
import { ListarTodosResponsaveis } from './use-cases/listar-todos-responsaveis.use-case';
import { AtualizarResponsavel } from './use-cases/atualizar-responsavel.use-case';
import { DeletarResponsavel } from './use-cases/deletar-responsavel.use-case';

@Module({
  controllers: [ResponsavelController],
  providers: [
    ResponsavelQuery,
    ResponsavelCommand,
    CriarResponsavelUseCase,
    MostrarUmResponsavel,
    ListarTodosResponsaveis,
    AtualizarResponsavel,
    DeletarResponsavel,
  ],
})
export class ResponsavelModule {}
