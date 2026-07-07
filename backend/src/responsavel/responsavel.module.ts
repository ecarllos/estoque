import { Module } from '@nestjs/common';
import { ResponsavelController } from './responsavel.controller';
import { CriarResponsavelUseCase } from './use-cases/criar-responsavel.use-case';
import { ResponsavelQuery } from './repository/query.repo';
import { responsavelCommand } from './repository/command.repo';

@Module({
  controllers: [ResponsavelController],
  providers: [CriarResponsavelUseCase, ResponsavelQuery, responsavelCommand],
})
export class ResponsavelModule {}
