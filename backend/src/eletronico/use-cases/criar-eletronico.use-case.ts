import { Injectable } from '@nestjs/common';
import { EletronicoQuery } from '../repository/query.repo';
import { EletronicoCommand } from '../repository/command.repo';
import { CriarEletronicoDto } from '../dto/criar-eletronico.dto';

@Injectable()
export class CriarEletronicoUseCase {
  constructor(
    private readonly query: EletronicoQuery,
    private readonly command: EletronicoCommand,
  ) {}

  async execute(dto: CriarEletronicoDto) {
    const create = await this.command.createEletronico(dto);

    return create;
  }
}
