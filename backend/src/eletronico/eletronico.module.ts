import { Module } from '@nestjs/common';
import { EletronicoController } from './eletronico.controller';
import { EletronicoCommand } from './repository/command.repo';
import { EletronicoQuery } from './repository/query.repo';
import { CriarEletronicoUseCase } from './use-cases/criar-eletronico.use-case';

@Module({
  controllers: [EletronicoController],
  providers: [EletronicoCommand, EletronicoQuery, CriarEletronicoUseCase],
})
export class EletronicoModule {}
